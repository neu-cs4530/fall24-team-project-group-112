import React from 'react';

interface NotificationFilterProps {
  onFilterChange: (type: string) => void;
}

const NotificationFilter: React.FC<NotificationFilterProps> = ({ onFilterChange }) => {
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange(e.target.value);
  };

  return (
    <select onChange={handleFilterChange}>
      <option value=''>All Notifications</option>
      <option value='type1'>Answers</option>
      <option value='type2'>Comments</option>
      <option value='type3'>Badges</option>
      <option value='type4'>Follows</option>
    </select>
  );
};

export default NotificationFilter;
