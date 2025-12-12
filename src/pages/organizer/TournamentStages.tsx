import React from 'react';
import {  Card } from 'antd';
import type { TournamentStepProps } from '@/common/types/tournament';
import BracketGenerator from '@/components/bracket/bracket';

const TournamentStages: React.FC<TournamentStepProps> = ({ data }) => {
 return (
    <div>
      <h1>Quản lý nhánh đấu</h1>
      <Card>
        <BracketGenerator
          tournamentId={data.basicInfo.id}
          tournamentFormat="double-elimination"
          maxParticipants={15}
          matchFormat="BO1"
          matchDuration={30}
          approvedTeamsCount={10}
          onBracketGenerated={() => {
            console.log('Bracket generated!');
          }}
        />
      </Card>
    </div>
  );
}
export default TournamentStages;