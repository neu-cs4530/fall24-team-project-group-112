import React from 'react';

/**
 * Interface representing the props for the Avatar component.
 *
 * - avatarName The name of the user's avatar image. Defaults to avatar1.
 * - width The width of the avatar image. This is optional and defaults to 150.
 * - height The height of the avatar image. This is optional and defaults to 150.
 * - circular A boolean that determines if the avatar image should be circular. This is optional and defaults to false.
 */
interface AvatarProps {
  avatarName?: string;
  width?: number;
  height?: number;
  circular?: boolean;
}

/**
 * Avatar component that displays the user's avatar image.
 *
 * @param avatarName The name of the user's avatar image. Defaults to avatar1.
 * @param width The width of the avatar image. This is optional and defaults to 150.
 * @param height The height of the avatar image. This is optional and defaults to 150.
 * @param circular A boolean that determines if the avatar image should be circular. This is optional and defaults to false.
 */
const Avatar = ({ avatarName, width = 150, height = 150, circular = false }: AvatarProps) => (
  <img
    src={`/images/${avatarName || 'avatar1'}.svg`}
    alt='avatar'
    width={width}
    height={height}
    style={{ borderRadius: circular ? '50%' : '0' }}
  />
);

export default Avatar;
