'use client';

import { Coach, Player } from '@ankora/models';
import {
  arrowDownCircle,
  arrowUpCircle,
  Avatar,
  Button,
  ModalComponent,
  PlayerStat,
  Separator,
  Toggle,
} from '@ankora/ui-library';
import { useMutation } from '@tanstack/react-query';
import classNames from 'classnames';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { apiClient } from '../../../lib/apiClient';
import EditPlayerForm from '../EditPlayerForm/EditPlayerForm';

interface PlayerInformationProps {
  player: Player;
  coaches?: Coach[];
}

export const PlayerInformation = ({
  player,
  coaches,
}: PlayerInformationProps) => {
  const { user, rank, weight, height, plays, dateOfBirth, sex, createdAt } =
    player;

  const [expand, setExpand] = useState(false);
  const router = useRouter();

  const [openDrawer, setOpenDrawer] = useState(false);

  const handleOpenDrawer = useCallback(() => {
    setOpenDrawer(!openDrawer);
  }, [openDrawer]);

  const handleEditPlayerSuccess = useCallback(() => {
    handleOpenDrawer();
    router.refresh();
  }, [handleOpenDrawer, router]);

  const handleExpand = useCallback(() => {
    setExpand(!expand);
  }, [expand]);

  const handleInjuryUpdate = useMutation(
    (toggle: boolean) => {
      const requestBody = {
        ...player,
        isInjured: toggle,
      };

      return apiClient.player.updateInjuryStatus({
        id: player.id,
        requestBody,
      });
    },
    {
      onSuccess: () => router.refresh(),
      onError: () => toast.error('Something went wrong'),
    },
  );

  const onChange = (e: boolean) => {
    handleInjuryUpdate.mutate(e);
  };

  return (
    <div className='md:max-w-[270px] w-full bg-gray-800 px-4 py-5 rounded-lg'>
      <div className='bg-gray-900 px-4 py-5 rounded-lg border border-solid border-gray-700 mb-5'>
        <div className='flex justify-between mb-4 items-center'>
          <Avatar
            className='w-[48px] h-[48px]'
            initials={user.fullName.charAt(0)}
          />
          <div className='flex-col flex items-end'>
            <h3 className='text-white'>UTR Rank</h3>
            <p className='text-2xl text-primary-400'>{rank || '-'}</p>
          </div>
        </div>
        <h2 className='text-gray-200 font-bold'>{user.fullName}</h2>
        <p className='text-gray-500 mb-3'>
          Joined in {dayjs(createdAt).format('MMMM YYYY')}
        </p>
        <p className='text-primary-500 mb-6 cursor-pointer hover:underline text-xs'>
          See players development
        </p>

        <Toggle
          dataCy='Injury_toggle'
          label={'Injured'}
          checked={player.isInjured}
          onChange={onChange}
          enabledBackground='bg-red-700'
        />
      </div>
      {!expand && (
        <div
          className='md:hidden flex justify-center text-white cursor-pointer items-center gap-2'
          onClick={handleExpand}
        >
          <Image src={arrowDownCircle} alt='down' width={16} height={16} />
          <p>See more</p>
        </div>
      )}

      <div
        className={classNames('md:block transition-all', {
          ['hidden']: !expand,
        })}
      >
        <PlayerStat
          dataCy='Weight'
          label='Weight'
          value={weight ? `${weight} kg` : 'Not set'}
        />
        <PlayerStat
          dataCy='Height'
          label='Height'
          value={height ? `${height} cm` : 'Not set'}
        />
        <PlayerStat dataCy='Plays' label='Plays' value={plays.join(', ')} />
        <Separator variant='dark' />
        <PlayerStat
          dataCy='DOB'
          label='DOB'
          value={dayjs(dateOfBirth).format('MMM D, YYYY')}
        />
        <PlayerStat dataCy='Gender' label='Gender' value={sex} />
        <PlayerStat
          dataCy='Age'
          label='Age'
          value={dayjs(Date.now()).diff(dateOfBirth, 'year', false).toString()}
        />
        <Separator variant='dark' />
        <PlayerStat dataCy='Email' label='Email' value={user.email} />
        <PlayerStat dataCy='Phone' label='Phone' value={user.phone} />
        <PlayerStat dataCy='Address' label='Address' value={user.address} />
        <PlayerStat dataCy='City' label='City' value={user.city} />
        <PlayerStat dataCy='Zip' label='Zip' value={user.zip} />
        {expand && (
          <div
            className='md:hidden flex justify-center text-white cursor-pointer mt-6 items-center gap-2'
            onClick={handleExpand}
          >
            <Image src={arrowUpCircle} alt='up' width={16} height={16} />
            <p>See less</p>
          </div>
        )}
      </div>
      <Button variant='primary' className='w-full' onClick={handleOpenDrawer}>
        Edit player
      </Button>
      <ModalComponent
        variant='drawer'
        isVisible={openDrawer}
        onClose={handleOpenDrawer}
        title='EDIT PLAYER'
      >
        <EditPlayerForm
          handleCreateSuccess={handleEditPlayerSuccess}
          player={player}
          coaches={coaches}
        />
      </ModalComponent>
    </div>
  );
};
