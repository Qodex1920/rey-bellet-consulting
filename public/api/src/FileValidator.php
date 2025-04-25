<?php

namespace FormMailer;

class FileValidator {
    private $maxSize;
    private $allowedTypes;
    private $maxFiles;

    public function __construct(int $maxSize = 5242880, array $allowedTypes = [], int $maxFiles = 3) {
        $this->maxSize = $maxSize; // 5MB par défaut
        $this->allowedTypes = $allowedTypes ?: [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'image/gif',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        $this->maxFiles = $maxFiles;
    }

    public function validate(array $files): array {
        $errors = [];
        $validFiles = [];
        $totalFiles = count($files['name']);

        if ($totalFiles > $this->maxFiles) {
            $errors[] = "Vous ne pouvez pas envoyer plus de {$this->maxFiles} fichiers.";
            return ['errors' => $errors, 'files' => []];
        }

        for ($i = 0; $i < $totalFiles; $i++) {
            if ($files['error'][$i] === UPLOAD_ERR_OK) {
                $tmpName = $files['tmp_name'][$i];
                $name = $files['name'][$i];
                $type = $files['type'][$i];
                $size = $files['size'][$i];

                // Vérification du type MIME
                if (!in_array($type, $this->allowedTypes)) {
                    $errors[] = "Le type de fichier '$name' n'est pas autorisé.";
                    continue;
                }

                // Vérification de la taille
                if ($size > $this->maxSize) {
                    $errors[] = "Le fichier '$name' dépasse la taille maximale autorisée.";
                    continue;
                }

                // Vérification supplémentaire du type MIME
                $finfo = finfo_open(FILEINFO_MIME_TYPE);
                $mimeType = finfo_file($finfo, $tmpName);
                finfo_close($finfo);

                if (!in_array($mimeType, $this->allowedTypes)) {
                    $errors[] = "Le type de fichier '$name' n'est pas autorisé.";
                    continue;
                }

                $validFiles[] = [
                    'name' => $name,
                    'type' => $type,
                    'tmp_name' => $tmpName,
                    'error' => UPLOAD_ERR_OK,
                    'size' => $size
                ];
            }
        }

        return [
            'errors' => $errors,
            'files' => $validFiles
        ];
    }
} 