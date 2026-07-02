# Retrofit + kotlinx.serialization
-keepattributes Signature, InnerClasses, EnclosingMethod, *Annotation*
-keepclassmembers class kotlinx.serialization.json.** { *** Companion; }
-keep,includedescriptorclasses class com.devmaniac.app.**$$serializer { *; }
-keepclassmembers class com.devmaniac.app.** { *** Companion; }
-keepclasseswithmembers class com.devmaniac.app.** { kotlinx.serialization.KSerializer serializer(...); }
-dontwarn okhttp3.internal.platform.**
-dontwarn org.conscrypt.**
