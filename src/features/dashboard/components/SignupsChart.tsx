import { AreaChart } from '@mantine/charts';
import { Badge, Card, Group, Text } from '@mantine/core';

/** Sample numbers. The API has no sign-up statistics, so replace this with a real endpoint. */
const SAMPLE_DATA = [4, 6, 5, 9, 8, 12, 10, 15, 13, 18, 16, 21, 19, 25].map(
  (signups, index) => ({
    day: `Day ${index + 1}`,
    signups,
  }),
);

export const SignupsChart = () => {
  return (
    <Card withBorder padding="md">
      <Group justify="space-between" mb="sm">
        <Text fw={500}>Sign-ups, last 14 days</Text>
        <Badge variant="light" color="gray">
          Sample data
        </Badge>
      </Group>
      <AreaChart
        h={220}
        data={SAMPLE_DATA}
        dataKey="day"
        series={[{ name: 'signups', label: 'Sign-ups', color: 'brand.6' }]}
        curveType="monotone"
        withDots={false}
        withYAxis={false}
        gridAxis="x"
      />
    </Card>
  );
};
