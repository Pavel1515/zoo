const multer = require('multer');
const imageSize = require('image-size');
const path = require('path');

// Настройка хранилища для загруженных файлов
const storage = multer.diskStorage({
  destination: 'images/', // Папка для сохранения файлов
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname); // Получаем расширение файла
    cb(null, file.fieldname + '-' + uniqueSuffix + extension); // Генерируем уникальное имя файла
  },
});

// Функция для проверки типа файла и разрешения
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Недопустимый тип файла'), false);
  }

  // Используйте библиотеку image-size для определения разрешения изображения
  const dimensions = imageSize(file.buffer);
  if (dimensions.width < 100 || dimensions.height < 100) {
    return cb(new Error('Разрешение изображения должно быть не менее 100x100 пикселей'), false);
  }

  cb(null, true);
};

// Создание объекта Multer middleware с обновленными параметрами
const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // Максимальный размер файла - 15 МБ
  fileFilter: fileFilter,
});

module.exports = upload;
