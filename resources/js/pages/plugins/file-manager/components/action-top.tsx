import { MyTooltipButton } from '@/components/my-tooltip-button';
import useTranslation from '@/hooks/use-translation';
import { FilePlus2Icon, FolderPlusIcon } from 'lucide-react';

const ActionTop = ({ setOpenUploadFileDialog, setOpenAddFolderDialog }) => {
    const { t } = useTranslation();
    return (
        <>
            <MyTooltipButton title={t("Upload Files")} variant={`outline`} size={`icon`} onClick={() => setOpenUploadFileDialog(true)}>
                <FilePlus2Icon className="stroke-primary" />
            </MyTooltipButton>

            <MyTooltipButton title={t("Add Sub-Folder")} variant={`outline`} size={`icon`} onClick={() => setOpenAddFolderDialog(true)}>
                <FolderPlusIcon className="stroke-warning" />
            </MyTooltipButton>
        </>
    );
};

export default ActionTop;
