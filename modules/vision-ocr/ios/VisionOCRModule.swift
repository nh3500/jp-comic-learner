import ExpoModulesCore
import Vision
import UIKit

public class VisionOCRModule: Module {
  public func definition() -> ModuleDefinition {
    Name("VisionOCR")

    AsyncFunction("recognizeText") { (imageUri: String, promise: Promise) in
      guard let url = URL(string: imageUri) else {
        promise.reject("INVALID_URI", "Invalid image URI: \(imageUri)")
        return
      }

      DispatchQueue.global(qos: .userInitiated).async {
        do {
          let imageData = try Data(contentsOf: url)
          guard let image = UIImage(data: imageData),
                let cgImage = image.cgImage else {
            promise.reject("INVALID_IMAGE", "Could not load image from URI")
            return
          }

          let request = VNRecognizeTextRequest { request, error in
            if let error = error {
              promise.reject("OCR_ERROR", error.localizedDescription)
              return
            }

            guard let observations = request.results as? [VNRecognizedTextObservation] else {
              promise.resolve([])
              return
            }

            let imageWidth = CGFloat(cgImage.width)
            let imageHeight = CGFloat(cgImage.height)

            let results: [[String: Any]] = observations.compactMap { observation in
              guard let candidate = observation.topCandidates(1).first else { return nil }

              let boundingBox = observation.boundingBox
              // Convert from normalized coordinates (bottom-left origin) to pixel coordinates (top-left origin)
              let x = boundingBox.origin.x * imageWidth
              let y = (1.0 - boundingBox.origin.y - boundingBox.height) * imageHeight
              let width = boundingBox.width * imageWidth
              let height = boundingBox.height * imageHeight

              return [
                "text": candidate.string,
                "x": x,
                "y": y,
                "width": width,
                "height": height,
                "confidence": candidate.confidence,
              ]
            }

            promise.resolve(results)
          }

          // Configure for Japanese text recognition
          request.recognitionLanguages = ["ja", "zh-Hans", "zh-Hant", "en"]
          request.recognitionLevel = .accurate
          request.usesLanguageCorrection = true

          let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
          try handler.perform([request])
        } catch {
          promise.reject("LOAD_ERROR", error.localizedDescription)
        }
      }
    }
  }
}
