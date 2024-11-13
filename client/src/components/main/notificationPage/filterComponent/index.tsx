import React from 'react';

interface NotificationFilterProps {
  onFilterChange: (type: string) => void;
}

const NotificationFilter: React.FC<NotificationFilterProps> = ({ onFilterChange }) => {
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange(e.target.value); // Pass only the selected value (string)
  };

  return (
    <div className='notification-filter'>
      <h3>Filter Notifications</h3>

      <label>
        <input type='radio' name='filter' value='' onChange={handleRadioChange} defaultChecked />
        All Notifications
      </label>

      <label>
        <input type='radio' name='filter' value='ANSWER' onChange={handleRadioChange} />
        Answers
      </label>

      <label>
        <input type='radio' name='filter' value='COMMENT' onChange={handleRadioChange} />
        Comments
      </label>

      <label>
        <input type='radio' name='filter' value='BADGE' onChange={handleRadioChange} />
        Badges
      </label>

      <label>
        <input type='radio' name='filter' value='FOLLOW' onChange={handleRadioChange} />
        Follows
      </label>
    </div>
  );
};

export default NotificationFilter;
