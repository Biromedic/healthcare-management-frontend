"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Autocomplete
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Navbar } from "../components/Navbar";
import { prescriptionApi } from "../api/client";

type Medicine = {
  id: string;
  name: string;
  price: number;
};

type PrescriptionFormValues = {
  patientTC: string;
  medicines: {
    medicineId: string;
    medicineName: string;
    quantity: number;
  }[];
};

export default function CreatePrescriptionPage() {
  const [searchResults, setSearchResults] = useState<Medicine[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { register, handleSubmit, control, setValue, formState: { errors } } =
    useForm<PrescriptionFormValues>({
      defaultValues: {
        patientTC: "",
        medicines: [{ medicineId: "", medicineName: "", quantity: 1 }],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicines",
  });

  const searchMedicines = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      setSearching(true);
      const response = await prescriptionApi.getMedicines(query);
      if (response.data?.content) {
        setSearchResults(response.data.content);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Medicine search failed:", error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const onSubmit = async (data: PrescriptionFormValues) => {
    setLoading(true);
    setServerError(null);
    setSuccess(null);
  
    try {
      const payload = {
        patientTC: data.patientTC,
        medicines: data.medicines.map((m) => ({
          medicineId: m.medicineId,
          medicineName: m.medicineName,
          quantity: m.quantity,
        })),
      };
  
      // Reçete oluştur
      const createResponse = await prescriptionApi.create(payload);
  
      // Reçete oluşturma başarılıysa Submit isteği gönder
      if (createResponse?.id) {
        await prescriptionApi.submit(createResponse.id);
        setSuccess("Prescription created and submitted successfully!");
      } else {
        throw new Error("Failed to retrieve prescription ID for submission.");
      }
    } catch (error: any) {
      console.error("Error during prescription creation/submission:", error);
      setServerError(error?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Container maxWidth="md">
      <Navbar />
      <Typography variant="h4" gutterBottom>
        Create Prescription
      </Typography>
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Patient TC"
            fullWidth
            margin="normal"
            {...register("patientTC", { required: "Patient TC is required" })}
            error={!!errors.patientTC}
            helperText={errors.patientTC?.message}
          />

          <Typography variant="h6" sx={{ mt: 2 }}>
            Medicines
          </Typography>

          {fields.map((field, index) => {
            const idError = errors.medicines?.[index]?.medicineId?.message;
            const qtyError = errors.medicines?.[index]?.quantity?.message;

            return (
              <Box
                key={field.id}
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <Autocomplete
                  options={searchResults}
                  getOptionLabel={(option) => option.name}
                  loading={searching}
                  onChange={(_, value) => {
                    if (value) {
                      setValue(`medicines.${index}.medicineId`, value.id);
                      setValue(`medicines.${index}.medicineName`, value.name);
                    } else {
                      setValue(`medicines.${index}.medicineId`, "");
                      setValue(`medicines.${index}.medicineName`, "");
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Medicine"
                      error={!!idError}
                      helperText={idError}
                      onChange={(e) => searchMedicines(e.target.value)}
                    />
                  )}
                />

                <TextField
                  label="Quantity"
                  type="number"
                  sx={{ width: 80, mx: 2 }}
                  {...register(`medicines.${index}.quantity`, {
                    required: "Quantity required",
                    valueAsNumber: true,
                    min: { value: 1, message: "Min 1" }
                  })}
                  error={!!qtyError}
                  helperText={qtyError}
                />

                <IconButton onClick={() => remove(index)} color="error">
                  <RemoveIcon />
                </IconButton>

                {/* hidden inputs to store validated data */}
                <input
                  type="hidden"
                  {...register(`medicines.${index}.medicineId`, {
                    validate: (val) => val !== "" || "Select a medicine"
                  })}
                />
                <input
                  type="hidden"
                  {...register(`medicines.${index}.medicineName`)}
                />
              </Box>
            );
          })}

          <Button
            type="button"
            variant="outlined"
            onClick={() =>
              append({ medicineId: "", medicineName: "", quantity: 1 })
            }
            startIcon={<AddIcon />}
          >
            Add Medicine
          </Button>

          {serverError && <Alert severity="error" sx={{ mt: 2 }}>{serverError}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Create Prescription"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
