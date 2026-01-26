import {
    Box,
    CircularProgress,
    IconButton,
    Modal,
    Stack,
    TextField,
    Chip,
} from "@mui/material";
import { useZTheme } from "../../../stores/useZTheme";
import { useTranslation } from "react-i18next";
import { CloseXIcon } from "../../../icons/CloseXIcon";
import { TextRob18Font2M } from "../../../components/Text2M";
import { IOperatingSystem } from "../../../hooks/useOperatingSystems";
import { useZVM } from "../../../stores/useZVM";
import { TextRob16FontL } from "../../../components/TextL";
import { TextRob14Font1Xs } from "../../../components/Text1Xs";
import { useState, useMemo } from "react";
import SearchIcon from "@mui/icons-material/Search";

interface IModalSelectOSProps {
    operatingSystems: IOperatingSystem[];
    isLoading: boolean;
}

export const ModalSelectOS = ({ operatingSystems, isLoading }: IModalSelectOSProps) => {
    const { mode, theme } = useZTheme();
    const { t } = useTranslation();
    const { isOpenVMMarketPlace, setIsOpenVMMarketPlace, setVmSO } = useZVM();
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const categories = useMemo(() => {
        const cats = new Set(operatingSystems.map((os) => os.category));
        return ["all", ...Array.from(cats)];
    }, [operatingSystems]);

    const filteredOS = useMemo(() => {
        return operatingSystems.filter((os) => {
            const matchesSearch =
                os.name.toLowerCase().includes(search.toLowerCase()) ||
                os.version.toLowerCase().includes(search.toLowerCase()) ||
                os.description.toLowerCase().includes(search.toLowerCase());

            const matchesCategory =
                selectedCategory === "all" || os.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [operatingSystems, search, selectedCategory]);

    const handleSelectOS = (os: IOperatingSystem) => {
        setVmSO({
            value: os.id,
            label: `${os.name} ${os.version}`,
        });
        setIsOpenVMMarketPlace(false);
    };

    return (
        <Modal
            open={isOpenVMMarketPlace}
            onClose={() => setIsOpenVMMarketPlace(false)}
            aria-hidden={!isOpenVMMarketPlace}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Stack
                sx={{
                    width: "90%",
                    maxWidth: "900px",
                    maxHeight: "80vh",
                    backgroundColor: theme[mode].mainBackground,
                    borderRadius: "12px",
                    padding: "24px",
                    gap: "24px",
                    overflowY: "auto",
                }}
            >
                <Stack
                    sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <TextRob18Font2M
                        sx={{
                            color: theme[mode].black,
                            fontSize: "20px",
                            fontWeight: "500",
                            lineHeight: "24px",
                        }}
                    >
                        {t("createVm.operationalSystem")}
                    </TextRob18Font2M>
                    <IconButton onClick={() => setIsOpenVMMarketPlace(false)}>
                        <CloseXIcon fill={theme[mode].gray} />
                    </IconButton>
                </Stack>

                <TextField
                    placeholder="Search operating systems..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: theme[mode].gray }} />,
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            backgroundColor: theme[mode].grayLight,
                        },
                    }}
                />

                {/* Category Filters */}
                <Stack direction="row" gap={1} flexWrap="wrap">
                    {categories.map((cat) => (
                        <Chip
                            key={cat}
                            label={cat.charAt(0).toUpperCase() + cat.slice(1)}
                            onClick={() => setSelectedCategory(cat)}
                            sx={{
                                backgroundColor:
                                    selectedCategory === cat ? theme[mode].blue : theme[mode].grayLight,
                                color:
                                    selectedCategory === cat ? theme[mode].btnText : theme[mode].primary,
                                "&:hover": {
                                    backgroundColor:
                                        selectedCategory === cat
                                            ? theme[mode].blue
                                            : theme[mode].blueLight,
                                },
                            }}
                        />
                    ))}
                </Stack>

                {isLoading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: "200px",
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <Stack gap={2}>
                        {filteredOS.map((os) => (
                            <Box
                                key={os.id}
                                onClick={() => handleSelectOS(os)}
                                sx={{
                                    padding: "16px",
                                    borderRadius: "12px",
                                    border: `1px solid ${theme[mode].grayLight}`,
                                    backgroundColor: theme[mode].grayLight,
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        borderColor: theme[mode].blueLight,
                                        backgroundColor: theme[mode].light,
                                    },
                                }}
                            >
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Stack gap={0.5}>
                                        <Stack direction="row" gap={1} alignItems="center">
                                            <TextRob16FontL
                                                sx={{
                                                    fontWeight: 500,
                                                    color: theme[mode].black,
                                                }}
                                            >
                                                {os.name} {os.version}
                                            </TextRob16FontL>
                                            {os.recommend && (
                                                <Chip
                                                    label="Recommended"
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: theme[mode].ok,
                                                        color: theme[mode].btnText,
                                                        fontSize: "10px",
                                                        height: "20px",
                                                    }}
                                                />
                                            )}
                                        </Stack>
                                        <TextRob14Font1Xs
                                            sx={{
                                                color: theme[mode].gray,
                                                fontSize: "14px",
                                            }}
                                        >
                                            {os.description}
                                        </TextRob14Font1Xs>
                                    </Stack>
                                    <Chip
                                        label={os.category}
                                        size="small"
                                        sx={{
                                            backgroundColor: theme[mode].blue,
                                            color: theme[mode].btnText,
                                            textTransform: "capitalize",
                                        }}
                                    />
                                </Stack>
                            </Box>
                        ))}
                        {filteredOS.length === 0 && (
                            <TextRob16FontL
                                sx={{
                                    textAlign: "center",
                                    color: theme[mode].gray,
                                    padding: "40px",
                                }}
                            >
                                No operating systems found
                            </TextRob16FontL>
                        )}
                    </Stack>
                )}
            </Stack>
        </Modal>
    );
};
