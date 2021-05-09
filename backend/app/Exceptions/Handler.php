<?php

namespace App\Exceptions;

use Asm89\Stack\CorsService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\File\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param Request $request
     * @param Throwable $exception
     * @return Response
     * @throws Throwable
     */
    public function render($request, Throwable $exception)
    {
        $response = $this->handleException($request, $exception);

        app(CorsService::class)->addActualRequestHeaders($response, $request);

        return $response;

    }

    /**
     * @param $request
     * @param Throwable $exception
     * @return JsonResponse|Response
     * @throws Throwable
     */
    public function handleException($request, Throwable $exception)
    {

        if ($exception instanceof AccessDeniedException) {
            return response()->json(['success' => 0, 'error' => $exception->getMessage()], 401);

        }

        if ($exception instanceof AccessDeniedHttpException) {
            return response()->json(['success' => 0, 'error' => $exception->getMessage()], 401);
        }

        if ($exception instanceof ValidationException) {
            return $this->convertValidationExceptionToResponse($exception, $request);
        }

        if ($exception instanceof ModelNotFoundException) {
            $name = strtolower(class_basename($exception->getModel()));

            return response()->json(['success' => 0, 'error' => ['name' => $name]], 404);
        }

        if ($exception instanceof AuthenticationException) {
            return $this->unauthenticated($request, $exception);
        }

        if ($exception instanceof AuthorizationException) {
            return response()->json(['success' => 0, 'error' => $exception->getMessage()], 403);
        }

        if ($exception instanceof MethodNotAllowedHttpException) {
            return response()->json(['success' => 0, 'error' => 'Invalid Method'], 405);
        }

        if ($exception instanceof NotFoundHttpException) {
            return response()->json(['success' => 0, 'error' => '404 Not Found'], 404);
        }

        if ($exception instanceof HttpException) {
            return response()->json(['success' => 0, 'error' => $exception->getMessage()], $exception->getStatusCode());
        }

        if ($exception instanceof QueryException) {
            return response()->json(['success' => 0, 'error' => $exception->getMessage()], 409);
        }

        if (config('app.debug')) {
            return parent::render($request, $exception);
        }

        return response()->json(['success' => 0, 'error' => 'Something went wrong'], 500);

    }

    /**
     * Create a response object from the given validation exception.
     *
     * @param ValidationException $e
     * @param Request $request
     * @return JsonResponse
     */
    protected function convertValidationExceptionToResponse(ValidationException $e, $request)
    {
        return response()->json(['success' => 0, 'error' => $e->validator->errors()->getMessages()], 422);
    }

    /**
     * Convert an authentication exception into an unauthenticated response.
     *
     * @param Request $request
     * @param AuthenticationException $exception
     * @return JsonResponse
     */
    protected function unauthenticated($request, AuthenticationException $exception)
    {
        return response()->json(['success' => 0, 'error' => 'unauthenticated'], 401);
    }
}
