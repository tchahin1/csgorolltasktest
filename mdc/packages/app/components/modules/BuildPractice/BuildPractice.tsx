import { ModalComponent } from '@ankora/ui-library';
import { MODALITY } from '@prisma/client';
import PracticeChecklistForm from '../PracticeChecklistForm/PracticeChecklistForm';
import PracticeQuestionsForm from '../PracticeQuestionsForm/PracticeQuestionsForm';
import PracticeVideoModule from '../PracticeVideoModule/PracticeVideoModule';
import { Practice } from '@ankora/models';

interface BuildPracticeProps {
  initialValues: Partial<Practice>;
  handleCreateSuccess: () => void;
  handleClose?: () => void;
}
export const BuildPractice = ({
  initialValues,
  handleCreateSuccess,
  handleClose,
}: BuildPracticeProps) => {
  const renderModalityContent = (modality: MODALITY) => {
    switch (modality) {
      case MODALITY.QUESTION:
        return (
          <PracticeQuestionsForm
            initialFormData={initialValues}
            handleCreateSuccess={handleCreateSuccess}
          />
        );
      case MODALITY.TODO:
        return (
          <PracticeChecklistForm
            initialFormData={initialValues}
            handleCreateSuccess={handleCreateSuccess}
          />
        );
      case MODALITY.VIDEO:
        return (
          <PracticeVideoModule
            initialFormData={initialValues}
            handleCreateSuccess={handleCreateSuccess}
          />
        );
      default:
        return null;
    }
  };

  const getModalVariant = (modality: MODALITY) => {
    switch (modality) {
      case MODALITY.QUESTION:
        return 'lg';
      case MODALITY.TODO:
        return 'lg';
      case MODALITY.VIDEO:
        return 'huge';
      default:
        return 'md';
    }
  };

  return (
    initialValues && (
      <ModalComponent
        title={initialValues?.name}
        onClose={handleClose}
        isVisible={!!initialValues}
        variant={getModalVariant(initialValues?.modality)}
      >
        <div className='pb-0 overflow-auto bg-gray-800 h-full'>
          {renderModalityContent(initialValues?.modality)}
        </div>
      </ModalComponent>
    )
  );
};
