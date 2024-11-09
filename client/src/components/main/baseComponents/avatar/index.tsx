import React from 'react';

/**
 * Interface representing the props for the Avatar component.
 *
 * - avatarName The name of the user's avatar image.
 */
interface AvatarProps {
  avatarName: string;
}

/**
 * Avatar component that displays the user's avatar image.
 *
 * @param avatarName The name of the user's avatar image.
 */
const Avatar = ({ avatarName }: AvatarProps) => (
  <img src={`/images/${avatarName}.svg`} alt='avatar' width='150px' height='150px' />
);

export default Avatar;
