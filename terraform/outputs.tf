output "bucket_metadata_file" {
  value = local_file.bucket_metadata.filename
  description = "Path to simulated bucket JSON metadata"
}

output "bigquery_dataset_file" {
  value = local_file.bigquery_dataset.filename
  description = "Path to simulated BigQuery dataset JSON metadata"
}

output "bigquery_sample_rows_file" {
  value = local_file.bigquery_sample_rows.filename
  description = "Path to sample rows JSON file"
}
