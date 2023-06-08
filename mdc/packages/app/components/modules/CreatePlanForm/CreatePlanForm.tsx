'use client';
import { ApiError, WeeklyPlansDto } from '@ankora/api-client';
import { Practice } from '@ankora/models';
import { Button, Separator } from '@ankora/ui-library';
import { Input, TagList } from '@ankora/ui-library/client';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { zodResolver } from '@hookform/resolvers/zod';
import { MODALITY } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { ElementRef, useRef } from 'react';
import { FieldError, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { apiClient } from '../../../lib/apiClient';
import PracticeDragList from '../PracticeDragList/PracticeDragList';
import { Tabs } from '../Tabs/Tabs';
import { FormSchemaType, Schema } from '../WeeklyPlans/types';
import WeeklyPlans from '../WeeklyPlans/WeeklyPlans';

interface CreatePlanFormProps {
  handleCreateSuccess: () => void;
  allPractices?: Practice[];
}

const CreatePlanForm = ({
  handleCreateSuccess,
  allPractices,
}: CreatePlanFormProps) => {
  const weeklyPlansRef = useRef<ElementRef<typeof WeeklyPlans>>();

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    watch,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(Schema),
    defaultValues: {
      weeklyPlans: [{ order: 1, dailyPlanPractices: [] }],
    },
  });

  const createPlan = useMutation(
    (data: FormSchemaType) => {
      const modifiedWeeklyPlans = data.weeklyPlans.map((weeklyPlan) => {
        const output: { day: number; practices: string[] }[] =
          weeklyPlan.dailyPlanPractices.reduce((acc, cur) => {
            const dayExists = acc.some((item) => item.day === cur.day);
            if (dayExists) {
              const index = acc.findIndex((item) => item.day === cur.day);
              acc[index].practices.push(cur.id);
            } else {
              acc.push({ day: cur.day, practices: [cur.id] });
            }
            return acc;
          }, []);

        return {
          ...weeklyPlan,
          week: `Week ${weeklyPlan.order}`,
          dailyPlanPractices: output,
        } as WeeklyPlansDto;
      });
      const requestBody = {
        name: data.name,
        tags: data.tags?.map((tag) => tag.value) || [],
        weeklyPlans: modifiedWeeklyPlans,
      };

      return apiClient.plan.create({
        requestBody,
      });
    },
    {
      onSuccess() {
        toast.success('Plan created successfully');
        handleCreateSuccess();
      },
      onError(e: ApiError) {
        toast.error(`Plan could not be created. ${e.body.message}`);
      },
    },
  );

  const handleCreatePlanFormSubmit: SubmitHandler<FormSchemaType> = async (
    data,
  ) => {
    createPlan.mutate(data);
  };

  const addPractice = (week: number, day: number, draggableId: string) => {
    weeklyPlansRef?.current?.addPractice(week, day, draggableId);
  };

  return (
    <form
      onSubmit={handleSubmit(handleCreatePlanFormSubmit)}
      className='w-full flex flex-col items-center justify-between rounded-b-lg h-full mb-0 overflow-auto'
    >
      <DragDropContext
        onDragEnd={(res: DropResult) => {
          if (!res.destination) {
            return;
          }
          if (
            res.destination.droppableId.includes('practice_table') &&
            !res.source.droppableId.includes('practice_table')
          ) {
            const destination = res.destination.droppableId.split('_');
            const [, , week, day] = destination;
            addPractice(+week, +day, res.draggableId);
          }
        }}
      >
        <div className='w-full flex flex-row p-4 pb-0 bg-gray-900 h-full'>
          <div className='w-[50%] px-6 py-3 border-r border-gray-600 pb-12 overflow-auto'>
            <Input
              dataCy='Plan_name-input'
              className='mb-12'
              variant='dark'
              label='Plan name'
              {...register('name')}
              error={errors['name']?.message as string}
            />
            <TagList
              dataCy='Tags-taglist'
              label='Tags'
              {...register('tags')}
              value={watch('tags')}
            />
            <Separator variant='dark' />
            <WeeklyPlans
              control={control}
              errors={errors['weeks'] as FieldError}
              ref={weeklyPlansRef}
              allPractices={allPractices}
            />
          </div>
          <div className='w-[50%] px-5 pt-9 pb-4'>
            <Droppable droppableId='practice_collection'>
              {(provided) => {
                return (
                  <Tabs
                    tabs={[
                      {
                        dataCy: 'Video-tab',
                        title: 'Video',
                        content: (
                          <PracticeDragList
                            ref={provided.innerRef}
                            modality={MODALITY.VIDEO}
                            practices={allPractices.filter(
                              (practice) =>
                                practice.modality === MODALITY.VIDEO,
                            )}
                          />
                        ),
                        key: 'video',
                      },
                      {
                        dataCy: 'Questions-tab',
                        title: 'Questions',
                        content: (
                          <PracticeDragList
                            ref={provided.innerRef}
                            modality={MODALITY.QUESTION}
                            practices={allPractices.filter(
                              (practice) =>
                                practice.modality === MODALITY.QUESTION,
                            )}
                          />
                        ),
                        key: 'questions',
                      },
                      {
                        dataCy: 'Checklist-tab',
                        title: 'Checklist',
                        content: (
                          <PracticeDragList
                            ref={provided.innerRef}
                            modality={MODALITY.TODO}
                            practices={allPractices.filter(
                              (practice) => practice.modality === MODALITY.TODO,
                            )}
                          />
                        ),
                        key: 'checklist',
                      },
                    ]}
                  />
                );
              }}
            </Droppable>
          </div>
        </div>
        <div className='flex w-full justify-end p-4 pr-5 bg-gray-700'>
          <Button dataCy='Save-button' className='flex !w-max' type='submit'>
            <p>Save</p>
          </Button>
        </div>
      </DragDropContext>
    </form>
  );
};
export default CreatePlanForm;
