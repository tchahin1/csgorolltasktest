'use client';

import { Player } from '@ankora/models';
import { Button, Separator, Loader } from '@ankora/ui-library';
import { ASSESSMENT_STATUS, ROLE } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { getAnswers } from '../../../helpers/getAnswers';
import { useAuth } from '../../../hooks/providers';
import { apiClient } from '../../../lib/apiClient';
import CoachQuestionaryForm from '../CoachQuestionaryForm/CoachQuestionaryForm';
import CreateEventForm from '../CreateEventForm/CreateEventForm';

interface AssessmentQuestionaryProps {
  id: string;
  player: Player;
  closeDrawer?: () => void;
}

const AssessmentQuestionary = ({
  id,
  player,
  closeDrawer,
}: AssessmentQuestionaryProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [scheduleDebriefForm, setScheduleDebriefForm] = useState(false);
  const { data: assessment, refetch } = useQuery(
    ['assessment'],
    () => apiClient.assessment.getAssessmentForCoach({ id }),
    {
      enabled: !!id,
    },
  );

  const handleCoachQuestionarySuccess = useCallback(() => {
    setScheduleDebriefForm(!scheduleDebriefForm);
    router.refresh();
  }, [router, scheduleDebriefForm]);

  useEffect(() => {
    if (id) refetch();
  }, [id, refetch]);

  if (!assessment?.data) return <Loader />;

  if (scheduleDebriefForm) {
    return (
      <CreateEventForm
        handleCreateSuccess={closeDrawer}
        initialValues={{
          title: `${assessment.data.title}`,
          teamOrPlayers: 'players',
          players: [player.id],
        }}
        role={user.role}
        assessmentId={assessment.data.id}
      />
    );
  }
  return (
    <div className='p-4'>
      <h2 className='text-white text-xl font-semibold mb-2'>
        {assessment.data.title}
      </h2>
      <h3 className='text-white text-base font-normal mb-9'>
        {assessment.data.description}
      </h3>
      <h4 className='text-white text-base font-medium mb-3'>Players goal</h4>
      <p className='break-keep text-gray-200 text-sm'>
        {assessment.data.notes}
      </p>
      <Separator variant='dark' />
      <h4 className='text-white text-base font-medium mb-3'>
        Players feedback
      </h4>
      {assessment.data.questionary?.questions.map(
        (question) =>
          question.role === ROLE.PLAYER &&
          getAnswers(
            question.type,
            question,
            assessment.data.answers.find(
              (answer) => answer.questionSlug === question.slug,
            )?.answer,
          ),
      )}
      <Separator variant='dark' />

      {assessment.data.status === ASSESSMENT_STATUS.COMPLETED ? (
        assessment.data.questionary?.questions.map(
          (question) =>
            question.role === ROLE.COACH &&
            getAnswers(
              question.type,
              question,
              assessment.data.answers.find(
                (answer) => answer.questionSlug === question.slug,
              )?.answer,
            ),
        )
      ) : (
        <CoachQuestionaryForm
          questions={assessment.data.questionary?.questions}
          handleCreateSuccess={handleCoachQuestionarySuccess}
          assessmentId={id}
        />
      )}
      {assessment.data.status === ASSESSMENT_STATUS.COMPLETED &&
        !assessment.data.appointmentId && (
          <div className='flex justify-end'>
            <Button
              className='mb-2 max-w-[190px]'
              onClick={() => setScheduleDebriefForm(true)}
            >
              Schedule Debrief Call
            </Button>
          </div>
        )}
    </div>
  );
};
export default AssessmentQuestionary;
