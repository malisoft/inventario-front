<template>
	<v-app>
		<core-view />
	</v-app>
</template>

<script>
import View from '@/components/core/View';
export default {
	props: {
		source: String,
	},
	components: {
		CoreView: View,
	},
};
</script>
