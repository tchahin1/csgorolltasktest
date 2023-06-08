import { Coach } from '@ankora/models';
import {
  ExerciseRepository,
  PlayerRepository,
  PracticeRepository,
} from '@ankora/repository';
import PracticeCollection from '../../components/modules/Practice/PracticeColection';
import { getS3SignedUrl } from '../../helpers/awsFileUpload';
import { getCurrentCoach } from '../../lib/auth.utils';
import prisma from '../../lib/prisma';

interface PageProps {
  searchParams: {
    'practice-search'?: string;
  };
}

const getVideos = async (coach: Coach, search: string) => {
  const videos = await ExerciseRepository.getAllForOrganization(
    prisma,
    coach.user.organizationId,
    search,
  );

  const signedVideos = [];
  for await (const exercise of videos) {
    if (exercise.file?.key) {
      const privateExerciseUrl = await getS3SignedUrl(exercise.file.key);

      signedVideos.push({
        ...exercise,
        file: { ...exercise.file, url: privateExerciseUrl },
      });
    } else {
      signedVideos.push(exercise);
    }
  }

  return signedVideos;
};

const getPractices = async (coach: Coach, search: string) => {
  const practices = await PracticeRepository.getAllForCoach(prisma, coach, {
    search,
  });

  const signedPractices = [];
  for await (const practice of practices) {
    const practiceExercises = [];

    for await (const pe of practice.practiceExercise) {
      const exerciseKey = pe.exercise.file.key;
      if (exerciseKey) {
        const privateExerciseUrl = await getS3SignedUrl(exerciseKey);
        practiceExercises.push({
          ...pe,
          exercise: {
            ...pe.exercise,
            file: { ...pe.exercise.file, url: privateExerciseUrl },
          },
        });
      } else {
        practiceExercises.push(pe);
      }
    }

    signedPractices.push({ ...practice, practiceExercise: practiceExercises });
  }

  return signedPractices;
};

const Practices = async (props: PageProps) => {
  const coach = await getCurrentCoach();
  const practices = await getPractices(
    coach,
    props.searchParams['practice-search'],
  );
  const players = await PlayerRepository.getAll(prisma, coach, {});
  const videos = await getVideos(coach, props.searchParams['practice-search']);

  return (
    <div className='w-full min-h-full bg-gray-900 p-8'>
      <h2 className='text-white mb-4 text-lg'>Practices</h2>
      <PracticeCollection
        practices={JSON.parse(JSON.stringify(practices))}
        videos={JSON.parse(JSON.stringify(videos))}
        players={JSON.parse(JSON.stringify(players.players))}
      />
    </div>
  );
};
export default Practices;
