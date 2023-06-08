import {
  ReturnBouncesStatistics,
  ReturnHitsStatistics,
} from '@ankora/api-client';
import { Session } from '@ankora/models';
import PlayerReturnBounces from '../PlayerReturnBounces/PlayerReturnBounces';
import PlayerReturnHitPosition from '../PlayerReturnHitPosition/PlayerReturnHitPosition';
import { Tabs } from '../Tabs/Tabs';

interface PlayerReturnProps {
  session: Session;
  returnHitStatistics: ReturnHitsStatistics;
  returnBouncesStatistics: ReturnBouncesStatistics;
}

export const PlayerReturn = ({
  session,
  returnHitStatistics,
  returnBouncesStatistics,
}: PlayerReturnProps) => (
  <Tabs
    tabs={[
      {
        title: 'Hit Position',
        content: (
          <PlayerReturnHitPosition
            session={session}
            statistics={returnHitStatistics}
          />
        ),
        key: 'hitPosition',
      },
      {
        title: 'Bounces',
        content: (
          <PlayerReturnBounces
            session={session}
            statistics={returnBouncesStatistics}
          />
        ),
        key: 'bounces',
      },
    ]}
    secondaryVariant
  />
);
