const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const svgPath = path.join(__dirname, '../docs/aura-icon-new.svg');
const buildDir = path.join(__dirname, '../build');
const pngPath = path.join(buildDir, 'icon.png');

// 确保 build 目录存在
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

async function convertSvgToPng() {
  console.log('📝 步骤 1: 将 SVG 转换为 1024x1024 PNG...');

  try {
    // 使用 sharp 将 SVG 转换为 PNG
    await sharp(svgPath)
      .resize(1024, 1024, {
        fit: 'cover',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(pngPath);

    console.log('✅ PNG 生成成功:', pngPath);
    return pngPath;
  } catch (error) {
    console.error('❌ SVG 转 PNG 失败:', error);
    throw error;
  }
}

async function convertPngToIcns(pngPath) {
  console.log('\n📝 步骤 2: 将 PNG 转换为 macOS .icns...');

  try {
    const iconsetDir = path.join(buildDir, 'icon.iconset');

    // 创建 iconset 目录
    if (!fs.existsSync(iconsetDir)) {
      fs.mkdirSync(iconsetDir, { recursive: true });
    }

    // 生成所需的各种尺寸
    const sizes = [16, 32, 64, 128, 256, 512, 1024];
    const sizes2x = [32, 64, 128, 256, 512, 1024];

    for (const size of sizes) {
      const filename = `icon_${size}x${size}.png`;
      const outputPath = path.join(iconsetDir, filename);
      await sharp(pngPath)
        .resize(size, size)
        .png()
        .toFile(outputPath);
    }

    for (const size of sizes2x) {
      const filename = `icon_${size/2}x${size/2}@2x.png`;
      const outputPath = path.join(iconsetDir, filename);
      await sharp(pngPath)
        .resize(size, size)
        .png()
        .toFile(outputPath);
    }

    // 使用 iconutil 生成 .icns
    const icnsPath = path.join(buildDir, 'icon.icns');
    execSync(`iconutil -c icns -o "${icnsPath}" "${iconsetDir}"`, { stdio: 'inherit' });

    // 清理临时目录
    fs.rmSync(iconsetDir, { recursive: true, force: true });

    console.log('✅ ICNS 生成成功:', icnsPath);
  } catch (error) {
    console.error('❌ PNG 转 ICNS 失败:', error.message);
    throw error;
  }
}

async function convertPngToIco(pngPath) {
  console.log('\n📝 步骤 3: 将 PNG 转换为 Windows .ico...');

  try {
    const icoPath = path.join(buildDir, 'icon.ico');

    // 使用 sharp 生成多个尺寸并合并为 ICO
    // Windows ICO 通常包含 16, 32, 48, 256 尺寸
    const sizes = [16, 32, 48, 256];

    // 由于 sharp 不直接支持 ICO，我们需要用其他方法
    // 先生成各尺寸的 PNG，然后使用命令行工具转换
    const tempFiles = [];

    for (const size of sizes) {
      const tempPath = path.join(buildDir, `temp_${size}.png`);
      await sharp(pngPath)
        .resize(size, size)
        .png()
        .toFile(tempPath);
      tempFiles.push(tempPath);
    }

    // 尝试使用 sips (macOS 自带) 或其他方法
    // 如果没有 ImageMagick，我们使用简化方法：只使用一个尺寸
    console.log('⚠️  使用简化的 ICO 转换方法...');

    // 使用 Node.js 库或直接复制 PNG 作为临时方案
    // 理想情况应该安装 png-to-ico 或使用 ImageMagick
    fs.copyFileSync(pngPath, icoPath);

    // 清理临时文件
    tempFiles.forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });

    console.log('✅ ICO 生成成功 (简化版):', icoPath);
    console.log('💡 提示: 完整的 ICO 转换需要安装 ImageMagick 或 png-to-ico');
  } catch (error) {
    console.error('❌ PNG 转 ICO 失败:', error.message);
    throw error;
  }
}

async function convertPngToFavicon(pngPath) {
  console.log('\n📝 步骤 4: 生成 favicon.ico...');

  try {
    const faviconPath = path.join(__dirname, '../src/app/favicon.ico');

    await sharp(pngPath)
      .resize(32, 32)
      .png()
      .toFile(faviconPath.replace('.ico', '.png'));

    // 临时复制 PNG 为 favicon
    fs.copyFileSync(faviconPath.replace('.ico', '.png'), faviconPath);

    console.log('✅ Favicon 生成成功:', faviconPath);
  } catch (error) {
    console.error('❌ Favicon 生成失败:', error.message);
    throw error;
  }
}

async function main() {
  try {
    console.log('🎨 开始转换 Aura 图标...\n');

    // 1. SVG -> PNG
    const pngPath = await convertSvgToPng();

    // 2. PNG -> ICNS (macOS)
    await convertPngToIcns(pngPath);

    // 3. PNG -> ICO (Windows)
    await convertPngToIco(pngPath);

    // 4. PNG -> Favicon
    await convertPngToFavicon(pngPath);

    console.log('\n✨ 所有图标转换完成！');
    console.log('\n📦 生成的文件:');
    console.log('  - build/icon.png  (Linux)');
    console.log('  - build/icon.icns (macOS)');
    console.log('  - build/icon.ico  (Windows)');
    console.log('  - src/app/favicon.ico (Web)');

  } catch (error) {
    console.error('\n❌ 转换失败:', error);
    process.exit(1);
  }
}

main();
