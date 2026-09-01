{{/* Generate basic labels */}}
{{- define "flask.labels" }}
generator: helm
date: {{ now | htmlDate }}
app: {{ .Release.Name }}
{{- end }}