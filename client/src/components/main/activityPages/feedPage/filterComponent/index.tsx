import React from 'react';

interface FeedFilterProps {
  onFilterChange: (type: string) => void;
}

const FeedFilter: React.FC<FeedFilterProps> = ({ onFilterChange }) => {
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange(e.target.value); // Pass only the selected value (string)
  };

  return (
    <div className='notification-filter'>
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
          value='Answer'
          onChange={handleRadioChange}
        />
        Answers
      </label>

      <label className='mr-3'>
        <input
          className='mr-1'
          type='radio'
          name='filter'
          value='Comment'
          onChange={handleRadioChange}
        />
        Comments
      </label>

      <label className='mr-3'>
        <input
          className='mr-1'
          type='radio'
          name='filter'
          value='Question'
          onChange={handleRadioChange}
        />
        Questions
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
  );
};

export default FeedFilter;
