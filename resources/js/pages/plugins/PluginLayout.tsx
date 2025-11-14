import { FileManagerProvider } from './file-manager/hooks/FileManagerContext';

const PluginLayout = ({ children }) => {
    return <FileManagerProvider>{children}</FileManagerProvider>;
};

export default PluginLayout;
