import { Center, Loader } from "@mantine/core";

export default function ScreenLoader() {
	return (
		<Center
			bg="blue.0"
			h="100dvh"
			children={<Loader color="gray" size={30} />}
		/>
	);
}
