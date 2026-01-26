import { Box, Modal, Stack } from "@mui/material";
import { ScreenFullPage } from "../../components/ScreenFullPage";
import { TextRob20Font1MB } from "../../components/Text1MB";
import { useZTheme } from "../../stores/useZTheme";
import { SampleStepper } from "../../components/SampleStepper";
import { useZMspRegisterPage } from "../../stores/useZMspRegisterPage";
import { useTranslation } from "react-i18next";
import { TextRob16Font1S } from "../../components/Text1S";
import { MspTableFilters } from "./MspTable/MspTableFilter";
import { MspTable } from "./MspTable/MspTable";
import { FormMSP } from "./components/FormMSP";
import { MspModal } from "./MspModal";
import { ModalDeleteMsp } from "./ModalDeleteMsp";
import { useEffect, useState } from "react";
import { Btn } from "../../components/Buttons/Btn";
import { ModalUSerNotCreated } from "./ModalUSerNotCreated";
import { ModalDeleteVMsFromMSP } from "./ModalDeleteVMsFromMSP";
import { useBrandMasterResources } from "../../hooks/useBrandMasterResources";
import { AbsoluteBackDrop } from "../../components/AbsoluteBackDrop";
import { useVmResource } from "../../hooks/useVmResource";

export const MSPRegisterPage = () => {
  const { theme, mode } = useZTheme();
  const {
    activeStep,
    modalOpen,
    mspToBeDeleted,
    setModalOpen,
    setMspToBeDeleted,
    setActiveStep,
    resetAll,
    setIsEditing,
    brandMasterDeleted,
    vmsToBeDeleted,
    setBrandMasterDeleted,
    setVmsToBeDeleted,
    enterOnEditing,
    setEnterOnEditing,
  } = useZMspRegisterPage();
  const { t } = useTranslation();
  const { isLoading } = useBrandMasterResources();
  const { isLoadingDeleteVM, deleteVM } = useVmResource();
  const [openModalUserNotCreated, setOpenModalUserNotCreated] = useState(false);

  const resetAllStepStates = () => {
    setIsEditing([]);
    setActiveStep(0);
    resetAll();
  };

  const handleCancelAfterDeleteMSP = () => {
    setMspToBeDeleted(null);
    setModalOpen(null);
    setMspToBeDeleted(null);
    setBrandMasterDeleted(null);
    setVmsToBeDeleted([]);
    resetAllStepStates();
  };

  const handleAfterDeleteMSP = async () => {
    await Promise.all(vmsToBeDeleted.map((vm) => deleteVM(vm.idVM)));
    handleCancelAfterDeleteMSP();
  };

  useEffect(() => {
    return () => {
      resetAllStepStates();
    };
  }, []);

  return (
    <ScreenFullPage
      title={
        <TextRob20Font1MB
          sx={{
            color: theme[mode].primary,
            fontSize: "28px",
            fontWeight: "500",
            lineHeight: "40px",
          }}
        >
          {t("mspRegister.title")}
        </TextRob20Font1MB>
      }
      sxTitleSubTitle={{
        paddingLeft: "40px",
        paddingRight: "40px",
      }}
      sxContainer={{
        paddingLeft: "40px",
        paddingRight: "40px",
        paddingBottom: "40px",
      }}
      subtitle={
        <Box
          sx={{
            maxWidth: "646px",
            "@media (max-width: 660px)": { maxWidth: "136px" },
          }}
        >
          <SampleStepper
            activeStep={activeStep}
            stepsNames={[
              t("mspRegister.stepOneTitle"),
              t("mspRegister.stepTwoTitle"),
            ]}
          />
        </Box>
      }
    >
      {Boolean(isLoading || isLoadingDeleteVM) && <AbsoluteBackDrop open />}
      <Stack
        sx={{
          width: "100%",
          gap: "26px",
          borderRadius: "16px",
          boxSizing: "border-box",
        }}
      >
        {
          <Stack
            sx={{
              background: theme[mode].mainBackground,
              borderRadius: "16px",
              width: "100%",
              padding: "24px",
              boxSizing: "border-box",
            }}
          >
            <Stack
              sx={{
                gap: enterOnEditing ? "0px" : "40px",
              }}
            >
              {!enterOnEditing && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "24px",
                  }}
                >
                  <TextRob16Font1S
                    sx={{
                      color: theme[mode].black,
                      fontSize: "16px",
                      fontWeight: 500,
                      lineHeight: "24px",
                    }}
                  >
                    {t("mspRegister.tableTitle")}
                  </TextRob16Font1S>
                  <Stack flexDirection="row" gap="16px" alignItems="center">
                    <MspTableFilters />
                    <Btn
                      onClick={() => {
                        resetAllStepStates();
                        setEnterOnEditing(true);
                      }}
                      sx={{
                        padding: "8px 24px",
                        borderRadius: "12px",
                        backgroundColor: theme[mode].blue,
                      }}
                    >
                      <TextRob16Font1S
                        sx={{ color: theme[mode].btnText, fontWeight: "500" }}
                      >
                        {t("mspRegister.addMsp")}
                      </TextRob16Font1S>
                    </Btn>
                  </Stack>
                </Box>
              )}
              {enterOnEditing ? <FormMSP /> : <MspTable />}
            </Stack>
          </Stack>
        }
      </Stack>
      {modalOpen !== null && (
        <Modal
          open={modalOpen !== null}
          onClose={() => setModalOpen(null)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>
            {(modalOpen === "editedMsp" || modalOpen === "createdMsp") && (
              <MspModal
                modalType={modalOpen}
                onClose={() => setModalOpen(null)}
              />
            )}
            {modalOpen === "deletedMsp" && mspToBeDeleted && (
              <ModalDeleteMsp
                mspToDelete={mspToBeDeleted}
                onClose={() => {
                  setModalOpen(null);
                  setMspToBeDeleted(null);
                }}
              />
            )}
          </div>
        </Modal>
      )}
      {openModalUserNotCreated && (
        <ModalUSerNotCreated
          open={openModalUserNotCreated}
          onClose={() => {
            setOpenModalUserNotCreated(false);
            resetAllStepStates();
          }}
        />
      )}
      {Boolean(brandMasterDeleted) && (
        <ModalDeleteVMsFromMSP
          onClose={handleCancelAfterDeleteMSP}
          onConfirm={handleAfterDeleteMSP}
          open={Boolean(brandMasterDeleted)}
          msp={brandMasterDeleted}
          vms={vmsToBeDeleted}
        />
      )}
    </ScreenFullPage>
  );
};
