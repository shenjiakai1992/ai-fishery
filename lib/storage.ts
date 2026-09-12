// lib/storage.ts — 文件存储抽象（IStorage）
// local（开发）：写入 public/uploads；oss（生产）：阿里云 OSS。
// 技术选型采用接口抽象，便于 local↔oss 无缝切换。
import { writeFile, mkdir, readFile } from "fs/promises";
import path from "path";
import { getEnv, isOss } from "./env";

export interface PutResult {
  /** 可公开访问的 URL（开发：/uploads/...；生产：CDN / OSS 外链） */
  url: string;
  /** 存储内部的相对 key */
  key: string;
}

export interface IStorage {
  /** 写入文本文件（HTML 笔记 / JSON） */
  putText(fileName: string, content: string): Promise<PutResult>;
  /** 写入二进制（图片） */
  putBinary(fileName: string, buffer: Buffer): Promise<PutResult>;
  /** 读取文本内容（用于详情页渲染、回写校验） */
  getText(key: string): Promise<string | null>;
}

/** 开发态：本地文件写入 public/uploads，dev server 直接能访问 */
class LocalStorage implements IStorage {
  private baseDir = path.join(process.cwd(), "public", "uploads");

  async putText(fileName: string, content: string): Promise<PutResult> {
    return this.write(fileName, saveAsContent(content));
  }

  async putBinary(fileName: string, buffer: Buffer): Promise<PutResult> {
    return this.write(fileName, Buffer.from(buffer));
  }

  private async write(fileName: string, data: Buffer): Promise<PutResult> {
    const filePath = path.join(this.baseDir, fileName);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, data).catch((e) => {
      // 忽略仅「写入成功但同名覆盖」的告警差异
      if (e && e.code === "EEXIST") return;
      throw e;
    });
    return { key: fileName, url: `/uploads/${fileName}` };
  }

  async getText(key: string): Promise<string | null> {
    const filePath = path.join(this.baseDir, key);
    return readFile(filePath, "utf-8").catch(() => null);
  }
}

function saveAsContent(s: string): Buffer {
  return Buffer.from(s, "utf-8");
}

/** 生产态：阿里云 OSS（需配置密钥后再接入，当前为占位实现） */
class OssStorage implements IStorage {
  async putText(fileName: string, content: string): Promise<PutResult> {
    return this.put(fileName, Buffer.from(content, "utf-8"));
  }

  async putBinary(fileName: string, buffer: Buffer): Promise<PutResult> {
    return this.put(fileName, buffer);
  }

  private async put(fileName: string, buffer: Buffer): Promise<PutResult> {
    const env = getEnv();
    if (!env.ALIYUN_OSS_ACCESS_KEY_ID) throw new Error("OSS 密钥未配置");
    // T3 TODO：接入 @alicloud OSS SDK 真实上传；当前仅返回占位（参数占位以避免未使用告警）
    void buffer;
    return { key: fileName, url: `${env.ALIYUN_OSS_BUCKET}.${env.ALIYUN_OSS_REGION}.aliyuncs.com/${fileName}` };
  }

  async getText(key: string): Promise<string | null> {
    throw new Error(`getText 生产态请走 OSS/源接口即可访问 key=${key}，不在服务端读取`);
  }
}

let instance: IStorage | null = null;

/** 全局单例存储实例：由 STORAGE_PROVIDER 决定后端 */
export function getStorage(): IStorage {
  if (instance) return instance;
  instance = isOss() ? new OssStorage() : new LocalStorage();
  return instance;
}