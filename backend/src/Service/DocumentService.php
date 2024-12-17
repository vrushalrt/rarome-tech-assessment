<?php

namespace App\Service;

use GuzzleHttp\Client as GuzzleClient;
use Psr\Log\LoggerInterface;

class DocumentService
{
    private LoggerInterface $logger;

    private $httpGuzzleClient;

    public function __construct(private string $storageDirectory, LoggerInterface $logger)
    {
        $this->httpGuzzleClient = new GuzzleClient(['verify' => false]);
        $this->logger = $logger;

        // Directory creation
        if (!is_dir($this->storageDirectory)) {
            mkdir($this->storageDirectory, 0755, true);
        }
    }

    public function fetchAndStoreDocuments(string $apiUrl): array
    {
        try {
            // Fetch API Data
            $response = $this->httpGuzzleClient->request('GET', $apiUrl);

            $statusCode = $response->getStatusCode();

            if ($statusCode !== 200) {
                throw new \RuntimeException("API returned status code $statusCode");
            }

            $documents = json_decode($response->getBody()->getContents());

            $savedFiles = [];
            foreach ($documents as $document) {
                if (empty($document->certificate) || empty($document->doc_no) || empty($document->description)) {
                    $this->logger->warning("Skipping invalid document entry", $document);
                    continue;
                }

                $decodedContent = base64_decode($document->certificate);
                if ($decodedContent === false) {
                    $this->logger->error("Failed to decode certificate for doc_no: {$document->doc_no}");
                    continue;
                }

                // Generate filename $document[0]->description
                $fileName = sprintf(
                    "%s_%s.pdf",
                    preg_replace('/[^A-Za-z0-9]/', '_', $document->description),
                    $document->doc_no
                );
                $filePath = $this->storageDirectory . DIRECTORY_SEPARATOR . $fileName;

                // Save file
                file_put_contents($filePath, $decodedContent);

                $savedFiles[] = $filePath;
            }

            return $savedFiles;
        } catch (\Exception $e) {
            $this->logger->error("An error occurred: " . $e->getMessage());
            throw $e;
        }
    }
}
