import React from 'react';
import { Select, Input, Divider, Space, Avatar, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { games, sortedGames, type Game, searchGames } from './games';

const { Option, OptGroup } = Select;

interface GameSelectProps {
  value?: string;
  onChange?: (value: string, game?: Game) => void;
  placeholder?: string;
  showSearch?: boolean;
  allowClear?: boolean;
  style?: React.CSSProperties;
  disabled?: boolean;
  size?: 'large' | 'middle' | 'small';
}

const GameSelect: React.FC<GameSelectProps> = ({
  value,
  onChange,
  placeholder = 'Chọn game',
  showSearch = true,
  allowClear = true,
  style,
  disabled = false,
  size = 'middle',
}) => {
  const selectedGame = value ? games.find(game => game.value === value) : undefined;

  // Custom dropdown render
  const popupRender = (menu: React.ReactNode) => (
    <div>
      <div style={{ padding: '8px' }}>
        <Input
          placeholder="Tìm kiếm game..."
          prefix={<SearchOutlined />}
          allowClear
          onChange={(e) => {
            // You can implement search logic here
          }}
        />
      </div>
      <Divider style={{ margin: '4px 0' }} />
      {menu}
    </div>
  );

  // Custom option render
  const optionRender = (game: Game) => (
    <Space>
      <Avatar 
        src={game.logo} 
        size="small" 
        style={{ backgroundColor: '#f0f0f0', padding: '2px' }}
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span>{game.name}</span>
        <span style={{ fontSize: '12px', color: '#999' }}>
          {game.description}
        </span>
      </div>
    </Space>
  );

  // Group games by category
  const gamesByCategory: Record<string, Game[]> = {};
  sortedGames.forEach(game => {
    const mainCategory = game.categories[0];
    if (!gamesByCategory[mainCategory]) {
      gamesByCategory[mainCategory] = [];
    }
    gamesByCategory[mainCategory].push(game);
  });

  return (
    <Select
      value={value}
      onChange={(value) => {
        const selected = games.find(game => game.value === value);
        onChange?.(value, selected);
      }}
      placeholder={placeholder}
      style={style}
      allowClear={allowClear}
      showSearch={showSearch}
      disabled={disabled}
      size={size}
      optionFilterProp="label"
      filterOption={(input, option) =>
        (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
      }
      popupRender ={popupRender}
      optionLabelProp="label"
    >
      {Object.entries(gamesByCategory).map(([category, categoryGames]) => (
        <OptGroup key={category} label={category}>
          {categoryGames.map(game => (
            <Option 
              key={game.id} 
              value={game.value}
              label={game.name}
            >
              <div style={{ display: 'flex', alignItems: 'center', padding: '4px 0' }}>
                <Avatar 
                  src={game.logo} 
                  size={24} 
                  style={{ 
                    marginRight: '12px',
                    backgroundColor: '#f0f0f0',
                    padding: '2px'
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 500 }}>{game.name}</span>
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    {game.description}
                  </span>
                  <div style={{ marginTop: '2px' }}>
                    {game.categories.slice(0, 2).map(cat => (
                      <Tag 
                        key={cat} 
                        // size="small" 
                        style={{ fontSize: '10px', padding: '0 4px', marginRight: '4px' }}
                      >
                        {cat}
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>
            </Option>
          ))}
        </OptGroup>
      ))}
    </Select>
  );
};

export default GameSelect;

// Hook để sử dụng game data
export const useGameData = () => {
  return {
    games,
    sortedGames,
    getGameByValue: (value: string) => games.find(game => game.value === value),
    getGameById: (id: string) => games.find(game => game.id === id),
  };
};