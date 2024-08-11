# Sử dụng image Node.js chính thức làm base image
FROM node:18-alpine

# Thiết lập biến môi trường
ENV NODE_ENV=production

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép file package.json và yarn.lock vào thư mục làm việc
COPY package.json yarn.lock ./

# Cài đặt các dependencies
RUN yarn install --production

# Sao chép toàn bộ mã nguồn vào thư mục làm việc
COPY . .

# Build ứng dụng
RUN yarn build

# Expose cổng mà ứng dụng sẽ chạy
EXPOSE 5000

# Lệnh để chạy ứng dụng
CMD ["node", "dist/main"]
