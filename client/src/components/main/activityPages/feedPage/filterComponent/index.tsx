import React from 'react';

/**
 * FeedFilterProps is an interface for the FeedFilter component props.
 *
 * @param {function} onFilterChange - The function to call when the filter changes.
 */
interface FeedFilterProps {
  onFilterChange: (type: string) => void;
}

/**
 * FeedFilter component displays a filter for the feed items.
 *
 * @param {function} onFilterChange - The function to call when the filter changes.
 */
const FeedFilter: React.FC<FeedFilterProps> = ({ onFilterChange }) => {
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange(e.target.value); // Pass only the selected value (string)
  };

  const styles = {
    container: 'border border-black rounded pl-3 py-2',
    title: 'font-bold mb-2',
    filterGroup: 'flex flex-wrap lg:flex-col',
    label: 'mr-3',
    input: 'mr-1 accent-stackpurple',
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Filter By:</h3>
      <div className={styles.filterGroup}>
        <label className={styles.label}>
          <input
            className={styles.input}
            type='radio'
            name='filter'
            value=''
            onChange={handleRadioChange}
            defaultChecked
          />
          All Notifications
        </label>

        <label className={styles.label}>
          <input
            className={styles.input}
            type='radio'
            name='filter'
            value='Answer'
            onChange={handleRadioChange}
          />
          Answers
        </label>

        <label className={styles.label}>
          <input
            className={styles.input}
            type='radio'
            name='filter'
            value='Comment'
            onChange={handleRadioChange}
          />
          Comments
        </label>

        <label className={styles.label}>
          <input
            className={styles.input}
            type='radio'
            name='filter'
            value='Question'
            onChange={handleRadioChange}
          />
          Questions
        </label>

        <label className={styles.label}>
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

export default FeedFilter;
