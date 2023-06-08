import { ExerciseRepository } from '@ankora/repository';
import ExerciseCollection from '../../components/modules/Exercise/ExerciseColection';
import { getCurrentCoach } from '../../lib/auth.utils';
import prisma from '../../lib/prisma';
import { getS3SignedUrl } from '../../helpers/awsFileUpload';
import { Coach } from '@ankora/models';

interface PageProps {
  searchParams: {
    search?: string;
  };
}

const getExercises = async (coach: Coach, search?: string) => {
  const videos = await ExerciseRepository.getAllForOrganization(
    prisma,
    coach.user.organizationId,
    search,
  );

  const adjustedExercises = [];
  for await (const exercise of videos) {
    if (exercise.file?.key) {
      const privateExerciseUrl = await getS3SignedUrl(exercise.file.key);

      adjustedExercises.push({
        ...exercise,
        file: { ...exercise.file, url: privateExerciseUrl },
      });
    } else {
      adjustedExercises.push(exercise);
    }
  }

  return adjustedExercises;
};

const Exercises = async (props: PageProps) => {
  const coach = await getCurrentCoach();
  const exercises = await getExercises(coach, props.searchParams.search);
  return (
    <div className='w-full min-h-full bg-gray-900 p-8'>
      <h2 className='text-white mb-4 text-lg'>Exercises</h2>
      <ExerciseCollection exercises={JSON.parse(JSON.stringify(exercises))} />
    </div>
  );
};
export default Exercises;
