<?php

namespace App\Controller;

use App\Service\DocumentService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class DocumentController extends AbstractController
{
    private DocumentService $documentService;

    public function __construct(DocumentService $documentService)
    {
        $this->documentService = $documentService;
    }

    #[Route('/fetch-documents', name: 'fetch_documents')]
    public function fetchDocuments(): JsonResponse
    { 
        $apiUrl = 'https://raw.githubusercontent.com/RashitKhamidullin/Educhain-Assignment/refs/heads/main/get-documents';

        try {
            $savedFiles = $this->documentService->fetchAndStoreDocuments($apiUrl);

            return new JsonResponse(['success' => true, 'files' => $savedFiles]);

        } catch (\Exception $e) {
            return new JsonResponse(['success' => false, 'message' => $e->getMessage()]);
        }
    }
}
