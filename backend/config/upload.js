const multer = require('multer');

// Configuração do multer para armazenar arquivos na memória
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Formato de arquivo não suportado. Use JPG, PNG ou WEBP.'));
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;