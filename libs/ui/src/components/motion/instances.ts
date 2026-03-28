import { motion } from 'motion/react';
import { Box, Flex } from '@buckethub/styled-system/jsx';

export const MotionBox = motion.create(Box);

export const MotionFlex: typeof MotionBox = motion.create(Flex);
