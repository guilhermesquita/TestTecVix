import { IconButton, Stack, Typography } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import React, { useEffect } from "react";
import { Btn } from "../../../../components/Buttons/Btn";
import { ImgFromDB } from "../../../../components/ImgFromDB";
import {
  ImgFlagOfBrazil,
  ImgFlagOfEUA,
} from "../../../../components/SwithLanguages";
import { TextRob16FontL } from "../../../../components/TextL";
import { MonitorIcon } from "../../../../icons/MonitorIcon";
import { PencilCicleIcon } from "../../../../icons/PencilCicleIcon";
import { TerminalIcon } from "../../../../icons/TerminalIcon";
import { useZTheme } from "../../../../stores/useZTheme";
import { useZUserProfile } from "../../../../stores/useZUserProfile";
import { IVMCreatedResponse } from "../../../../types/VMTypes";
import { getVMOwnership } from "../../../../utils/getVMOwnership";
import { makeEllipsis } from "../../../../utils/makeEllipsis";
import { useVmResource } from "../../../../hooks/useVmResource";
import { useZMyVMsList } from "../../../../stores/useZMyVMsList";
import { PlayCircleIcon } from "../../../../icons/PlayCircleIcon";
import { StopCircleIcon } from "../../../../icons/StopCircleIcon";
import { TrashIcon } from "../../../../icons/TrashIcon";
import { ModalStartVM } from "../ModalStartVM";
import { ModalStopVM } from "../ModalStopVM";
import { ModalDeleteVM } from "../ModalDeleteVM";
import { useStatusInfo } from "../../../../hooks/useStatusInfo";

interface IProps {
  vm: IVMCreatedResponse;
  index: number;
}

export const RowVM = ({ vm, index }: IProps) => {
  const { mode, theme } = useZTheme();
  const [row, setRow] = React.useState<IVMCreatedResponse>(vm);
  const [vmIDToStop, setVmIDToStop] = React.useState<number>(0);
  const [vmIDToStart, setVmIDToStart] = React.useState<number>(0);
  const [vmIDToDelete, setVmIDToDelete] = React.useState<number>(0);
  const { currentVM, setCurrentVM } = useZMyVMsList();
  const { idBrand, role } = useZUserProfile();
  const { getStatus } = useStatusInfo();
  const {
    getOS,
    getVMById,
    isLoading: isLoadingVm,
    startVm,
    stopVm,
    deleteVM,
  } = useVmResource();

  const idVM: number = Number(row.idVM);
  const labelId = `enhanced-table-checkbox-${index}`;
  const idRef = open ? "simple-popover" : undefined;
  const isLoading = isLoadingVm;

  const handleClick = (newVMCurrent: IVMCreatedResponse) => {
    if (currentVM && currentVM.idVM === vm.idVM) return;
    setCurrentVM(newVMCurrent);
  };

  const handleConfirVMStatusChange = async () => {
    let response = null;
    if (vmIDToStop) {
      response = await stopVm(vmIDToStop);
    } else if (vmIDToStart) {
      response = await startVm(vmIDToStart);
    }

    if (response && !response.error && response.data) {
      setRow(response.data);
    }

    setVmIDToStop(0);
    setVmIDToStart(0);
  };

  const handleConfirmDelete = async () => {
    if (vmIDToDelete) {
      const response = await deleteVM(vmIDToDelete);
      if (response && "idVM") {
        setRow(response as IVMCreatedResponse);
      }
      setVmIDToDelete(0);
    }
  };

  useEffect(() => {
    setRow(vm);
  }, [vm]);

  if (row.deletedAt) return null;

  return (
    <React.Fragment key={`row-fragment-${idVM}`}>
      <TableRow
        // hover
        tabIndex={-1}
        key={row.idVM}
        sx={{
          backgroundColor:
            index % 2 === 0 ? theme[mode].btnWhite : theme[mode].lightV2,
          "&.Mui-selected.MuiTableRow-hover": {
            backgroundColor: "inherit",
          },
          "& .MuiTableCell-root": {
            borderBottom: "none",
          },
        }}
      >
        {/* Logo and Name */}
        <TableCell
          key={row.idVM + "logo-name"}
          component="th"
          id={labelId}
          scope="row"
          sx={{
            padding: "16px",
          }}
        >
          <Stack
            sx={{
              width: "100%",
              flexDirection: "row",
              gap: "16px",
              maxWidth: "200px",
            }}
          >
            {/* Logo */}
            <Stack
              sx={{
                width: "24px",
                height: "24px",
                minWidth: "24px",
                minHeight: "24px",
                "@media (max-width: 659px)": {
                  display: "none",
                },
              }}
            >
              <ImgFromDB
                src={getVMOwnership(row).logo}
                alt="logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </Stack>
            <Typography
              sx={{
                color: theme[mode].dark,
                "@media (max-width: 659px)": {
                  fontSize: "12px",
                },
                ...makeEllipsis(),
              }}
            >
              {row.vmName}
            </Typography>
          </Stack>
        </TableCell>
        {/* Status - monitor - terminal */}
        <TableCell
          key={row.idVM + "status"}
          align="center"
          sx={{
            "@media (max-width: 700px)": {
              padding: 0,
            },
          }}
        >
          <Stack
            sx={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              gap: "8px",
            }}
          >
            <Stack
              sx={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                flexWrap: "wrap",
                "@media (max-width: 659px)": {
                  display: "none",
                },
              }}
            >
              {row.vmIpsRegions?.region.includes("bre") && <ImgFlagOfBrazil />}
              {row.vmIpsRegions?.region.includes("usa") && <ImgFlagOfEUA />}
              <Stack
                sx={{
                  backgroundColor: getStatus(row).background,
                  width: "fit-content",
                  color: getStatus(row).color,
                  px: "8px",
                  borderRadius: "12px",
                  "@media (max-width: 700px)": {
                    width: "12px",
                    height: "12px",
                    padding: 0,
                    overflow: "hidden",
                    color: getStatus(row).background,
                  },
                }}
              >
                {getStatus(row).text}
              </Stack>
            </Stack>
            {/* Terminal & Monitor */}
            <Stack
              sx={{
                flexDirection: "row",
                gap: "8px",
                flexWrap: "wrap",
                "@media (max-width: 659px)": {
                  justifyContent: "center",
                  gap: "2px",
                },
              }}
            >
              {getOS({ osValue: row.os }).hasTerminal && (
                <Btn
                  disabled={isLoading || !getStatus(row).isRunning}
                  onClick={() => { }}
                  sx={{
                    width: "40px",
                    height: "27px",
                    border: "1px solid",
                    borderColor: theme[mode].blueDark,
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "row",
                    padding: "0px 4px",
                    ":disabled": {
                      opacity: 0.4,
                    },
                    "@media (max-width: 659px)": {
                      border: "none",
                      padding: "0px 2px",
                    },
                  }}
                >
                  <TerminalIcon
                    width={"24px"}
                    height={"24px"}
                    fill={theme[mode].blueDark}
                  />
                </Btn>
              )}
              {/* Monitor */}
              {getOS({ osValue: row.os }).hasMonitor && (
                <Btn
                  disabled={isLoading || !getStatus(row).isRunning}
                  onClick={() => { }}
                  sx={{
                    width: "40px",
                    height: "27px",
                    border: "1px solid",
                    borderColor: theme[mode].blueDark,
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "row",
                    padding: "0px 4px",
                    ":disabled": {
                      opacity: 0.4,
                    },
                    "@media (max-width: 659px)": {
                      border: "none",
                      padding: "0px 2px",
                    },
                  }}
                >
                  <MonitorIcon
                    width={"24px"}
                    height={"24px"}
                    fill={theme[mode].blueDark}
                  />
                </Btn>
              )}
            </Stack>
          </Stack>
        </TableCell>
        {/* vCPU */}
        <TableCell
          key={row.idVM + "vcpu"}
          id={`container-vm-${row.idVM}`}
          aria-describedby={idRef}
          align="center"
          sx={{
            color: theme[mode].primary,
            "@media (max-width: 659px)": {
              display: "none",
            },
          }}
        >
          {`${row.vCPU}`}
        </TableCell>
        {/* RAM */}
        <TableCell
          key={row.idVM + "ram"}
          align="center"
          sx={{
            color: theme[mode].dark,
            "@media (max-width: 659px)": {
              display: "none",
            },
          }}
        >
          {`${row.ram} GB`}
        </TableCell>
        {/* Disk */}
        <TableCell
          key={row.idVM + "disk"}
          align="center"
          sx={{
            color: theme[mode].dark,
            "@media (max-width: 659px)": {
              display: "none",
            },
          }}
        >
          {`${row.disk} GB`}
        </TableCell>
        {/* OS */}
        <TableCell
          key={row.idVM + "os"}
          align="center"
          sx={{
            color: theme[mode].primary,
            "@media (max-width: 659px)": {
              display: "none",
            },
          }}
        >
          <Stack
            sx={{
              width: "100%",
              flexDirection: "row",
              gap: "16px",
              maxWidth: "150px",
              justifyContent: "center",
              margin: "0 auto",
            }}
          >
            <Typography
              sx={{
                color: theme[mode].dark,
                textAlign: "center",
                ...makeEllipsis(),
              }}
            >
              {`${row.os}`}
            </Typography>
          </Stack>
        </TableCell>
        {/* Owner */}
        <TableCell
          key={row.idVM + "owner"}
          align="center"
          sx={{
            maxWidth: "86px",
            "@media (max-width: 659px)": {
              fontSize: "12px",
            },
          }}
        >
          <TextRob16FontL
            sx={{
              fontWeight: "400",
              color: theme[mode].primary,
              "@media (max-width: 659px)": {
                fontSize: "12px",
                textAlign: "left",
              },
              ...makeEllipsis(),
            }}
          >
            {`${getVMOwnership(row).name}`}
          </TextRob16FontL>
        </TableCell>
        {/* Stop / Start / Edit */}
        <TableCell
          key={row.idVM + "edit"}
          align="center"
          sx={{
            width: "50px",
            height: "58px",
            position: "relative",
            padding: "8px",
            paddingRight: "16px",
          }}
        >
          <Stack
            sx={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              "@media (max-width: 659px)": {
                gap: "4px",
                flexWrap: "wrap",
              },
            }}
          >
            {(idBrand === null || idBrand === row.idBrandMaster) &&
              (role === "admin" || role === "manager") && (
                <>
                  {getStatus(row).isRunning && (
                    <IconButton
                      disabled={row.status === "STOPPED" || row.status === null}
                      onClick={() => setVmIDToStop(row.idVM)}
                      sx={{
                        gap: "8px",
                        ":hover": { opacity: 0.8 },
                        ":disabled": { opacity: 0.5 },
                      }}
                    >
                      <StopCircleIcon fill={theme[mode].lightRed} />
                    </IconButton>
                  )}
                  {getStatus(row).isStopped && (
                    <IconButton
                      disabled={row.status === "RUNNING" || row.status === null}
                      onClick={() => setVmIDToStart(row.idVM)}
                      sx={{
                        gap: "8px",
                        ":hover": { opacity: 0.8 },
                        ":disabled": { opacity: 0.5 },
                      }}
                    >
                      <PlayCircleIcon fill={theme[mode].greenLight} />
                    </IconButton>
                  )}
                  <Btn
                    onClick={() => handleClick(row)}
                    sx={{
                      borderRadius: "50%",
                    }}
                  >
                    <PencilCicleIcon fill={theme[mode].blueMedium} />
                  </Btn>
                  {role === "admin" && (
                    <Btn
                      onClick={() => setVmIDToDelete(row.idVM)}
                      sx={{
                        borderRadius: "50%",
                      }}
                    >
                      <TrashIcon fill={theme[mode].danger} width="20px" height="20px" />
                    </Btn>
                  )}
                </>
              )}
          </Stack>
        </TableCell>
      </TableRow>

      {Boolean(vmIDToStart) && (
        <ModalStartVM
          vmName={row.vmName}
          idVM={vmIDToStart}
          onConfirm={handleConfirVMStatusChange}
          onCancel={() => setVmIDToStart(0)}
        />
      )}
      {Boolean(vmIDToStop) && (
        <ModalStopVM
          vmName={row.vmName}
          idVM={vmIDToStop}
          onConfirm={handleConfirVMStatusChange}
          onCancel={() => setVmIDToStop(0)}
        />
      )}
      {Boolean(vmIDToDelete) && (
        <ModalDeleteVM
          vmName={row.vmName}
          idVM={vmIDToDelete}
          onConfirm={handleConfirmDelete}
          onCancel={() => setVmIDToDelete(0)}
        />
      )}
    </React.Fragment>
  );
};
