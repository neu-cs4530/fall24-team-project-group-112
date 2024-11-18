import React from 'react';

interface NotificationFilterProps {
  onFilterChange: (type: string) => void;
}

const NotificationFilter: React.FC<NotificationFilterProps> = ({ onFilterChange }) => {
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange(e.target.value); // Pass only the selected value (string)
  };

  return (
    <div className='notification-filter flex flex-col mt-5 ml-1 border border-black rounded px-3 py-2'>
      <h3 className='font-bold mb-2'>Filter By:</h3>

      <label className='mr-3'>
        <input
          className='mr-1'
          type='radio'
          name='filter'
          value=''
          onChange={handleRadioChange}
          defaultChecked
        />
        All Notifications
      </label>

      <label className='mr-3'>
        <input
          className='mr-1'
          type='radio'
          name='filter'
          value='ANSWER'
          onChange={handleRadioChange}
        />
        Answers
      </label>

      <label className='mr-3'>
        <input
          className='mr-1'
          type='radio'
          name='filter'
          value='COMMENT'
          onChange={handleRadioChange}
        />
        Comments
      </label>

      <label className='mr-3'>
        <input
          className='mr-1'
          type='radio'
          name='filter'
          value='BADGE'
          onChange={handleRadioChange}
        />
        Badges
      </label>

      <label>
        <input
          className='mr-1'
          type='radio'
          name='filter'
          value='FOLLOW'
          onChange={handleRadioChange}
        />
        Follows
      </label>
    </div>
  );
};

export default NotificationFilter;
