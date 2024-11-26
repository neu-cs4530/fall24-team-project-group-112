import { TagData } from '../../../../types';
import useTagSelected from '../../../../hooks/useTagSelected';

/**
 * Props for the Tag component.
 *
 * t - The tag object.
 * clickTag - Function to handle the tag click event.
 */
interface TagProps {
  t: TagData;
  clickTag: (tagName: string) => void;
}

/**
 * Tag component that displays information about a specific tag.
 * The component displays the tag's name, description, and the number of associated questions.
 * It also triggers a click event to handle tag selection.
 *
 * @param t - The tag object .
 * @param clickTag - Function to handle tag clicks.
 */
const TagView = ({ t, clickTag }: TagProps) => {
  const { tag } = useTagSelected(t);

  const styles = {
    tagNode: 'border border-dashed p-2 flex flex-col justify-items-center align-items-center',
    tagName: 'text-stackpurple',
  };

  return (
    <div className={styles.tagNode} onClick={() => clickTag(t.name)}>
      <div className={styles.tagName}>{tag.name}</div>
      <div>{tag.description}</div>
      <div>{t.qcnt} questions</div>
    </div>
  );
};

export default TagView;
