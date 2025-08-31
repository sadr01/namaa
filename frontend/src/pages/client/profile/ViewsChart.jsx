import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from "recharts";
import { useEffect } from 'react';
import BackButton from '../components/BackButton.jsx'
import fetchApi from '../../../more/fetchApi.js';
import { Box, Skeleton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppModal } from '../components/ModalContext.jsx';

export default function SimpleCharts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showModal, hideModal } = useAppModal();
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchApi('/users/views');
        if (res.ok) {
          setData(res.data);
        } else {
          showModal({ content: <p>{res.data.message}</p> });
          navigate('set');
        }
      } catch (error) {
        showModal({ content: <p>خطا در ارتباط!</p> })
      } finally {
        setLoading(false);
      }
    })()
  }, []);
  return (
    loading ?
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 9, gap: 2 }}>
        <Skeleton animation="wave" variant="rounded" width='100%' height={50} />
        <Skeleton animation="wave" variant="rounded" width='100%' height={400} />

      </Box>
      :
      <Box
        sx={{
          display: "flex",
          flexDirection: 'column',

          width: "100%",
          height: 'auto',
          p: 0, m: 0
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <BackButton address="/set" />
        </Box>
        <Typography variant='h6' sx={{ mt: 2, mb: 3 }}>
          آمار بازدید از صفحه شما در سی روز گذشته
        </Typography>
        <ResponsiveContainer width='100%' height={400}>
          <BarChart data={data} >
            {/* گرید ملایم */}
            <CartesianGrid strokeDasharray="4 4" stroke="#ffffff55" />

            {/* محور X */}
            <XAxis
              dataKey="day"
              stroke="#fff"
              height={80}
              angle={-90}
              textAnchor="end"
              tick={{ fill: "#fff", fontSize: 12, dy: 60 }}
            />

            {/* محور Y */}
            <YAxis
              width={15} // به جای پیش‌فرض 60
              stroke="#ffffff"
              tick={{ fill: "#fff", fontSize: 12, dx: -10 }}
            />

            {/* Tooltip کاستوم شده */}
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div
                      style={{
                        background: "rgba(34,34,34,0.9)",
                        padding: "12px",
                        borderRadius: "10px",
                        color: "#fff",
                        boxShadow: "0 0 10px rgba(255,255,255,0.3)",
                      }}
                    >
                      تاریخ: <b>{label}</b> <br />
                      تعداد بازدید: <b>{payload[0].value}</b>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* ستون‌ها */}
            <Bar dataKey="views" fill="#fff" radius={[6, 6, 0, 0]}>
              <Cell cursor="pointer" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
  )
}
