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
import { useAuth } from "../contexts/AuthContext";
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
  const { user } = useAuth();
  const [searchResults, setSearchResults] = useState<Medicine[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form tanımı
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

  // İlaç araması (public endpoint)
  const searchMedicines = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      setSearching(true);
      const response = await prescriptionApi.getMedicines(query);
      if (response.data && response.data.content) {
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

  // Form submit
  const onSubmit = async (data: PrescriptionFormValues) => {
    setLoading(true);
    setServerError(null);
    setSuccess(null);

    try {
      // Validasyon sonrası, her bir ilacın ID dolu olduğundan emin olabiliriz.
      const payload = {
        patientTC: data.patientTC,
        medicines: data.medicines.map(m => ({
          medicineId: m.medicineId,
          medicineName: m.medicineName,
          quantity: m.quantity
        }))
      };

      // /prescriptions/v1 endpoint'ine POST
      const response = await prescriptionApi.create(payload);
      setSuccess("Prescription created successfully!");
      console.log("Created Prescription:", response);
    } catch (error: any) {
      console.error("Error creating prescription:", error);
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

      <Paper sx={{ p: 3, mt: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Patient TC"
            {...register("patientTC", { required: "Patient TC is required" })}
            error={!!errors.patientTC}
            helperText={errors.patientTC?.message}
            fullWidth
            margin="normal"
          />

          <Typography variant="h6" sx={{ mt: 2 }}>
            Medicines
          </Typography>

          {fields.map((field, index) => {
            const medIdError = errors.medicines?.[index]?.medicineId?.message;
            const quantityError = errors.medicines?.[index]?.quantity?.message;

            return (
              <Box
                key={field.id}
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <Autocomplete
                  options={searchResults}
                  getOptionLabel={(option) => option.name}
                  loading={searching}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Medicine"
                      error={!!medIdError}
                      helperText={medIdError}
                      onChange={(e) => searchMedicines(e.target.value)}
                    />
                  )}
                  onChange={(_, value) => {
                    if (value) {
                      setValue(`medicines.${index}.medicineId`, value.id);
                      setValue(`medicines.${index}.medicineName`, value.name);
                    } else {
                      setValue(`medicines.${index}.medicineId`, "");
                      setValue(`medicines.${index}.medicineName`, "");
                    }
                  }}
                />

                <TextField
                  label="Quantity"
                  type="number"
                  sx={{ width: 100, mx: 2 }}
                  error={!!quantityError}
                  helperText={quantityError}
                  {...register(`medicines.${index}.quantity`, {
                    required: "Quantity is required",
                    valueAsNumber: true,
                    min: { value: 1, message: "Min quantity is 1" }
                  })}
                />

                <IconButton onClick={() => remove(index)} color="error">
                  <RemoveIcon />
                </IconButton>

                {/* Gizli alanlar: validate 'medicineId' dolu mu? */}
                <input
                  type="hidden"
                  {...register(`medicines.${index}.medicineId`, {
                    validate: (val) =>
                      val !== "" || "You must select a valid medicine"
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

          {serverError && <Alert severity="error">{serverError}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Create Prescription"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
