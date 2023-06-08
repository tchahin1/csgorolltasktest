import { Button, Textarea, TextareaVariants } from '@ankora/ui-library';
import PracticeVideoTable from '../PracticeVideoTable/PracticeVideoTable';
import VideoExercisesCollection from '../VideoExercisesCollection/VideoExercisesCollection';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useCallback, useState } from 'react';
import { EXERCISE_TYPE, Practice } from '@ankora/models';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useForm,
  useFieldArray,
  SubmitHandler,
  FieldError,
} from 'react-hook-form';
import { z } from 'zod';
import { DnDItem } from '../../../types/dnd';
import { useExercises } from '../../../hooks/providers';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../lib/apiClient';
import { toast } from 'react-toastify';
import { ApiError } from '@ankora/api-client';

const Schema = z.object({
  instructions: z.string(),
  exercises: z
    .object({
      duration: z.string().min(1, { message: 'This field is required' }),
      reps: z.string().min(1, { message: 'This field is required' }),
      type: z.enum([EXERCISE_TYPE.EXERCISE, EXERCISE_TYPE.REST]),
      exercise: z.object({ id: z.string() }).nullable(),
      practiceExerciseId: z.optional(z.string().nullable()),
    })
    .array(),
});

type FormSchemaType = z.infer<typeof Schema>;

interface PracticeVideoModuleProps {
  handleCreateSuccess: () => void;
  initialFormData?: Partial<Practice>;
}

const PracticeVideoModule = ({
  handleCreateSuccess,
  initialFormData,
}: PracticeVideoModuleProps) => {
  const [selectedPracticesIds, setSelectedPracticesIds] = useState<string[]>(
    [],
  );

  const {
    handleSubmit,
    formState: { errors },
    control,
    register,
    reset,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(Schema),
    defaultValues: {
      instructions: initialFormData.instructions || '',
      exercises: initialFormData.practiceExercise
        ? initialFormData.practiceExercise.map((practiceExercise) => ({
            ...practiceExercise,
            duration: practiceExercise.duration.toString(),
            reps: practiceExercise.reps.toString(),
            type: practiceExercise.exerciseType,
            practiceExerciseId: practiceExercise.id,
          }))
        : undefined,
    },
  });

  const {
    fields: practiceExercises,
    remove,
    insert,
    append,
    move,
  } = useFieldArray({
    control,
    name: 'exercises', // unique name for field array
  });

  const { exercises } = useExercises();

  const createPracticeVideo = useMutation(
    (data: FormSchemaType) => {
      const requestBody = {
        name: initialFormData.name,
        description: initialFormData.description,
        practiceType: initialFormData.practiceType,
        modality: initialFormData.modality,
        instructions: data.instructions,
        practiceExercises: data.exercises.map((exerciseData, index) => ({
          exerciseId: exerciseData.exercise?.id,
          exerciseType: exerciseData.type,
          duration: parseInt(exerciseData.duration, 10),
          reps: parseInt(exerciseData.reps, 10),
          sortValue: index,
        })),
      };

      return apiClient.practice.create({
        requestBody,
      });
    },
    {
      onSuccess() {
        toast.success('Practice created successfully');
        handleCreateSuccess();
        reset();
      },
      onError(e: ApiError) {
        toast.error(`Practice could not be updated. ${e.body.message}`);
      },
    },
  );

  const updatePracticeVideo = useMutation(
    (data: FormSchemaType) => {
      const requestBody = {
        practiceExercises: data.exercises.map((exerciseData, index) => ({
          exerciseId: exerciseData.exercise?.id,
          exerciseType: exerciseData.type,
          duration: parseInt(exerciseData.duration, 10),
          reps: parseInt(exerciseData.reps, 10),
          sortValue: index,
          id: exerciseData.practiceExerciseId,
        })),
      };

      return apiClient.practice.updatePractice({
        id: initialFormData.id,
        requestBody,
      });
    },
    {
      onSuccess() {
        toast.success('Practice updated successfully');
        handleCreateSuccess();
        reset();
      },
      onError(e: ApiError) {
        toast.error(`Practice could not be updated. ${e.body.message}`);
      },
    },
  );

  const addExercise = (draggableId: string, droppableIndex: number) => {
    const exercise = exercises.find((el) => el.id === draggableId);
    const newItem = {
      exercise,
      type: EXERCISE_TYPE.EXERCISE,
      reps: undefined,
      duration: undefined,
    };

    insert(droppableIndex, newItem);
  };

  const reorder = (draggableIndex: number, droppableIndex: number) => {
    move(draggableIndex, droppableIndex);
  };

  const handleItemSelect = (itemId: string, itemState: boolean) => {
    setSelectedPracticesIds((prevState) => {
      if (itemState) return [...prevState, itemId];
      const newState = prevState.filter((el) => el !== itemId);
      return newState;
    });
  };

  const handleItemsCopy = () => {
    for (const selectedPractice of selectedPracticesIds) {
      append(
        practiceExercises.find(
          (practiceExercise) => practiceExercise.id === selectedPractice,
        ),
      );
    }

    setSelectedPracticesIds([]);
  };

  const handleItemsDelete = () => {
    const selectedPracticesIndexes = selectedPracticesIds.map(
      (selectedPracticeId) =>
        practiceExercises.findIndex(
          (practiceExercise) => practiceExercise.id === selectedPracticeId,
        ),
    );

    remove(selectedPracticesIndexes);
    setSelectedPracticesIds([]);
  };

  const handleAddRest = useCallback(() => {
    if (!selectedPracticesIds.length) {
      append({
        type: EXERCISE_TYPE.REST,
        reps: '1',
        exercise: null,
      });
    } else {
      selectedPracticesIds.forEach((selectedPracticeId, index) => {
        const practiceIndex = practiceExercises.findIndex(
          (practiceExercise) => practiceExercise.id === selectedPracticeId,
        );
        insert(practiceIndex + 1 + index, {
          type: EXERCISE_TYPE.REST,
          reps: '1',
          exercise: null,
        });
      });
    }
    setSelectedPracticesIds([]);
  }, [append, insert, practiceExercises, selectedPracticesIds]);

  const handlePracticeVideosSubmit: SubmitHandler<FormSchemaType> = async (
    data,
  ) => {
    if (initialFormData.id) updatePracticeVideo.mutate(data);
    else createPracticeVideo.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handlePracticeVideosSubmit)}
      className='w-full flex flex-col items-center justify-between rounded-b-lg h-full mb-0'
    >
      <DragDropContext
        onDragEnd={(res: DropResult) => {
          if (!res.destination) {
            return;
          }
          if (res.destination.droppableId === 'video_table') {
            if (res.source.droppableId !== 'video_table') {
              addExercise(res.draggableId, res.destination.index);
            } else {
              reorder(res.source.index, res.destination.index);
            }
          }
        }}
      >
        <div className='w-full flex flex-row p-4 pb-0'>
          <div className='w-[50%] pl-1 pr-6 py-3 border-r border-gray-600 '>
            <Textarea
              className='mb-12'
              variant={TextareaVariants.Dark}
              label='Instructions (optional)'
              {...register('instructions')}
              error={errors['instructions']?.message as string}
            />
            <PracticeVideoTable
              practiceExercises={practiceExercises as DnDItem[]}
              selectedPracticesIds={selectedPracticesIds}
              setSelectedPracticesIds={handleItemSelect}
              onCopy={handleItemsCopy}
              onAddRest={handleAddRest}
              onDelete={handleItemsDelete}
              control={control}
              errors={errors['exercises'] as FieldError[]}
            />
          </div>
          <div className='w-[50%] px-5 pt-9 pb-4'>
            <Droppable droppableId='video_collection'>
              {(provided) => {
                return <VideoExercisesCollection ref={provided.innerRef} />;
              }}
            </Droppable>
          </div>
        </div>
        <div className='flex w-full justify-end p-4 pr-5 bg-gray-700'>
          <Button className='flex !w-max' dataCy='submit_button' type='submit'>
            <p>Save</p>
          </Button>
        </div>
      </DragDropContext>
    </form>
  );
};

export default PracticeVideoModule;
