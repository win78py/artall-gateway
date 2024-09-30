# Stage 1: Build stage
FROM node:18-alpine AS builder

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép file package.json và yarn.lock vào thư mục làm việc
COPY package.json yarn.lock ./

# Cài đặt các dependencies cần thiết cho việc build
RUN yarn install

# Sao chép toàn bộ mã nguồn vào thư mục làm việc
COPY . .

# Build ứng dụng
RUN yarn build

# Stage 2: Production stage
FROM node:18-alpine

# Thiết lập biến môi trường
ENV NODE_ENV=production

# Thiết lập thư mục làm việc
WORKDIR /app

# Chỉ copy các file cần thiết từ giai đoạn build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock

# Cài đặt các production dependencies
RUN yarn install --production

# Expose cổng mà ứng dụng sẽ chạy
EXPOSE 5000

# Lệnh để chạy ứng dụng
CMD ["node", "dist/main"]