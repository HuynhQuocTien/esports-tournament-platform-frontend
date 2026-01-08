// components/tournament/TournamentTreeVisualization.tsx
import React, { useRef, useEffect } from 'react';
import { Card, Typography, Tag, Button } from 'antd';
import * as d3 from 'd3';
import type { Bracket, Match } from '@/common/types';

const { Text } = Typography;

interface TournamentTreeVisualizationProps {
  bracket: Bracket;
  onMatchClick?: (match: Match) => void;
}

const TournamentTreeVisualization: React.FC<TournamentTreeVisualizationProps> = ({
  bracket,
  onMatchClick,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !bracket.matches || bracket.matches.length === 0) return;

    // Xóa SVG cũ
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);
    const width = containerRef.current?.clientWidth || 800;
    const height = bracket.matches.length * 100;

    svg.attr('width', width).attr('height', height);

    // Sắp xếp matches theo round và order
    const rounds = Array.from(new Set(bracket.matches.map(m => m.round)))
      .sort((a, b) => a - b);

    // Tính toán vị trí cho mỗi match
    const matchPositions = new Map();
    const verticalSpacing = 120;
    const horizontalSpacing = 200;

    rounds.forEach((round, roundIndex) => {
      const roundMatches = bracket.matches
        .filter(m => m.round === round)
        .sort((a, b) => a.order - b.order);

      roundMatches.forEach((match, matchIndex) => {
        const x = 50 + roundIndex * horizontalSpacing;
        const y = 50 + matchIndex * verticalSpacing;
        
        matchPositions.set(match.id, { x, y, match });
      });
    });

    // Vẽ các đường nối
    bracket.matches.forEach(match => {
      if (match.connections?.winnerTo) {
        const fromPos = matchPositions.get(match.id);
        const toPos = matchPositions.get(match.connections.winnerTo.matchId);
        
        if (fromPos && toPos) {
          svg.append('path')
            .attr('d', `M ${fromPos.x + 150} ${fromPos.y} 
                       C ${fromPos.x + 180} ${fromPos.y},
                         ${toPos.x - 30} ${toPos.y},
                         ${toPos.x} ${toPos.y}`)
            .attr('stroke', '#52c41a')
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .attr('marker-end', 'url(#arrowhead)');
        }
      }
    });

    // Thêm marker cho arrowhead
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#52c41a');

    // Vẽ các match nodes
    matchPositions.forEach((pos, matchId) => {
      const g = svg.append('g')
        .attr('transform', `translate(${pos.x}, ${pos.y})`)
        .style('cursor', 'pointer')
        .on('click', () => onMatchClick?.(pos.match));

      // Vẽ box
      g.append('rect')
        .attr('width', 140)
        .attr('height', 60)
        .attr('rx', 8)
        .attr('fill', 'white')
        .attr('stroke', '#1890ff')
        .attr('stroke-width', 2);

      // Thêm thông tin match
      g.append('text')
        .attr('x', 70)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .text(`Match ${pos.match.order}`);

      // Team names
      g.append('text')
        .attr('x', 10)
        .attr('y', 35)
        .attr('font-size', '12px')
        .text(pos.match.team1?.name?.substring(0, 15) || 'TBD');

      g.append('text')
        .attr('x', 10)
        .attr('y', 50)
        .attr('font-size', '12px')
        .text(pos.match.team2?.name?.substring(0, 15) || 'TBD');
    });

  }, [bracket.matches]);

  return (
    <div ref={containerRef} style={{ position: 'relative', overflow: 'auto' }}>
      <svg ref={svgRef} style={{ width: '100%', minHeight: '500px' }} />
    </div>
  );
};

export default TournamentTreeVisualization;