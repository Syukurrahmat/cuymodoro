import { Box, BoxProps, Container, Progress, rem, Title } from '@mantine/core';
import { ReactNode } from 'react';

interface TimeCount extends BoxProps { 
	children: ReactNode;
	progress?: number;
}

export default function TimeCount({ progress, children,  ...props }: TimeCount) {
	return (
		<Box {...props}>
			<Title
				ta="center"
				size="h1"
				fz={{ base: '19vw', sm: '15vw', lg: '14vw' }}
				component="p"
				c="gray.9"
				children={children}
			/>
			<Container px="0" h={rem(8)} size="sm" w="100%">
				{typeof progress == 'number' && (
					<Progress
						radius="md"
						size="md"
						transitionDuration={500}
						value={progress}
						striped={false}
					/>
				)}
			</Container>
		</Box>
	);
}
