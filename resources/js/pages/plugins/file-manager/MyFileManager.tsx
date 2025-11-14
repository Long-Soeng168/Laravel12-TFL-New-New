import { FileManagerProvider } from './hooks/FileManagerContext';
import { MyFileManagerDialog } from './my-file-manager-dialog';

export default function MyFileManager({
    handleInsertMedia,
    toolbarContainerId,
}: {
    handleInsertMedia?: (type: 'image' | 'file', url: string, fileName?: string) => void;
    toolbarContainerId?: string;
}) {
    return (
        <FileManagerProvider>
            <MyFileManagerDialog toolbarContainerId={toolbarContainerId} handleInsertMedia={handleInsertMedia} />
        </FileManagerProvider>
    );
}
