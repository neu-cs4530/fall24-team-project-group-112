import React from 'react';

interface NotificationFilterProps {
  onFilterChange: (type: string) => void;
}

const NotificationFilter: React.FC<NotificationFilterProps> = ({ onFilterChange }) => {
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange(e.target.value); // Pass only the selected value (string)
  };

  return (
    <div className='w-full border border-black rounded pl-3 py-2'>
      <h3 className='font-bold mb-2'>Filter By:</h3>
      <div className='flex flex-wrap md:flex-col'>
        <label className='mr-3'>
          <input
            className='mr-1 accent-stackpurple'
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
            className='mr-1 accent-stackpurple'
            type='radio'
            name='filter'
            value='Answer'
            onChange={handleRadioChange}
          />
          Answers
        </label>

        <label className='mr-3'>
          <input
            className='mr-1 accent-stackpurple'
            type='radio'
            name='filter'
            value='Comment'
            onChange={handleRadioChange}
          />
          Comments
        </label>

        <label className='mr-3'>
          <input
            className='mr-1 accent-stackpurple'
            type='radio'
            name='filter'
            value='Badge'
            onChange={handleRadioChange}
          />
          Badges
        </label>

        <label>
          <input
            className='mr-1'
            type='radio'
            name='filter'
            value='Follow'
            onChange={handleRadioChange}
          />
          Follows
        </label>
      </div>
    </div>
  );
};

export default NotificationFilter;
