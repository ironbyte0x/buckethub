import { ArrowUpDownIcon, FolderOpenIcon, PlugIcon, PlusIcon, SearchIcon } from 'lucide-react';
import { Box, Flex, Grid } from '@buckethub/styled-system/jsx';
import { Button, Icon, State, Text } from '@buckethub/ui';
import { Navigate } from '@tanstack/react-router';
import Logo from '@/assets/logo.svg?react';
import { getLastVisitedBucketId, useBuckets } from '@/services/buckets';
import { AddBucketDialog } from '../../features/add-bucket';
import { View } from '../../layout';

const features = [
  {
    icon: FolderOpenIcon,
    title: 'Browse & Navigate',
    description: 'Explore your bucket structure with an intuitive file browser'
  },
  {
    icon: ArrowUpDownIcon,
    title: 'Upload & Download',
    description: 'Transfer files seamlessly between local and cloud storage'
  },
  {
    icon: PlugIcon,
    title: 'Multi-Provider',
    description: 'Connect to AWS S3, MinIO, R2, and other compatible services'
  },
  {
    icon: SearchIcon,
    title: 'Quick Search',
    description: 'Find objects instantly across all your connected buckets'
  }
];

export const HomeView: React.FunctionComponent = () => {
  const { data: buckets } = useBuckets();

  if (buckets.length > 0) {
    const lastVisitedId = getLastVisitedBucketId();
    const targetBucket =
      (lastVisitedId
        ? buckets.find((bucket) => bucket.id.toString() === lastVisitedId)
        : undefined) ?? buckets[0];

    return (
      <Navigate
        to="/buckets/$bucketId/{-$key}"
        params={{
          bucketId: targetBucket.id.toString()
        }}
        replace
      />
    );
  }

  return (
    <View
      css={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Flex
        css={{ flexDirection: 'column', alignItems: 'center', width: 'full', maxWidth: '540px' }}
      >
        <State>
          <State.Header>
            <State.Media variant="default">
              <Logo style={{ width: '46px', height: '46px' }} />
            </State.Media>

            <State.Title css={{ textStyle: 'title-large', marginTop: '1' }}>
              Welcome to Buckethub
            </State.Title>

            <State.Description>
              Your unified S3 bucket management platform.
              <br />
              Connect, explore, and manage your cloud storage with ease.
            </State.Description>
          </State.Header>

          <State.Content>
            <State.Actions>
              <AddBucketDialog.Trigger
                render={(props) => (
                  <Button {...props} variant="primary" size="sm" css={{ marginTop: '4' }}>
                    <Icon as={PlusIcon} size="sm" />
                    Add your first bucket
                  </Button>
                )}
              />
            </State.Actions>
          </State.Content>
        </State>

        <Grid
          css={{
            gridTemplateColumns: { base: '1fr', sm: '1fr 1fr' },
            gap: '3',
            width: 'full',
            paddingInline: '4',
            paddingBottom: '4'
          }}
        >
          {features.map((feature) => (
            <Flex
              key={feature.title}
              css={{
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2',
                padding: '5',
                borderRadius: 'lg',
                border: '1px solid',
                borderColor: 'border-input',
                textAlign: 'center'
              }}
            >
              <Box
                css={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '9',
                  height: '9',
                  borderRadius: 'md',
                  backgroundColor: 'background-surface',
                  color: 'text-muted'
                }}
              >
                <Icon as={feature.icon} size="lg" />
              </Box>

              <Text variant="body-large-emphasized">{feature.title}</Text>

              <Text variant="body-medium" color="muted">
                {feature.description}
              </Text>
            </Flex>
          ))}
        </Grid>
      </Flex>
    </View>
  );
};
