import { useState } from 'react';
import { Button, ResponsiveDialog } from '@buckethub/ui';
import { useNavigate } from '@tanstack/react-router';
import { useObjectsLazy } from '@/services/objects';
import { FolderSelect } from '../../../../components/folder-select';
import { useNavigationData } from '../../use-navigation-data';

export const NewFolderForm: React.FunctionComponent = () => {
  const { bucketId, prefix } = useNavigationData();

  const navigate = useNavigate();

  const [selectedPrefix, setSelectedPrefix] = useState(prefix);

  const { data: objects, isLoading } = useObjectsLazy({
    bucketId,
    prefix: selectedPrefix
  });

  const isNewFolder = objects && !objects.length;

  return (
    <>
      <ResponsiveDialog.Body>
        <FolderSelect
          bucketId={bucketId}
          defaultValue={selectedPrefix}
          onValueChange={setSelectedPrefix}
        />
      </ResponsiveDialog.Body>

      <ResponsiveDialog.Footer>
        <ResponsiveDialog.CloseTrigger render={<Button variant="secondary">Cancel</Button>} />

        <ResponsiveDialog.CloseTrigger
          render={
            <Button
              variant="primary"
              disabled={isLoading || !isNewFolder}
              onClick={() => {
                navigate({
                  from: '/buckets/$bucketId/{-$key}',
                  params: {
                    bucketId: bucketId,
                    key: selectedPrefix
                  }
                });
              }}
            >
              Create
            </Button>
          }
        />
      </ResponsiveDialog.Footer>
    </>
  );
};
