import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";

const API_URL = "/api/coupons";

// Async thunks

export const createCoupon = createAsyncThunk(
  "coupon/createCoupon",
  async ({ coupon, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/admin/create`, coupon, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      console.log("created coupon", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create coupon");
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  "coupon/deleteCoupon",
  async ({ id, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${API_URL}/admin/delete/${id}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete coupon");
    }
  }
);

export const fetchAllCoupons = createAsyncThunk(
  "coupon/fetchAllCoupons",
  async (jwt, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/admin/all`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      console.log("all coupons", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch coupons");
    }
  }
);

// Initial state
const initialState = {
  coupons: [],
  cart: null,
  loading: false,
  error: null,
  couponCreated: false,
  couponApplied: false,
};

// Slice
const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.couponCreated = false;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons.push(action.payload);
        state.couponCreated = true;
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create coupon";
        state.couponCreated = false;
      })
      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = state.coupons.filter(
          (coupon) => coupon.id !== parseInt(action.meta.arg.id.toString())
        );
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete coupon";
      })
      .addCase(fetchAllCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.couponCreated = false;
      })
      .addCase(fetchAllCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
      })
      .addCase(fetchAllCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch coupons";
      });
  },
});

export default couponSlice.reducer;
