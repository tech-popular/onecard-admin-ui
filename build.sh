#!/bin/sh
npm run build

echo 'i3HBPf4P$Nj0' | docker login registry.cn-beijing.aliyuncs.com -u test_chushujuan@9fbank --password-stdin

docker build -t registry.cn-beijing.aliyuncs.com/9fbank/onecard-admin-ui:latest -f Dockerfile .
docker push registry.cn-beijing.aliyuncs.com/9fbank/onecard-admin-ui:latest

