terraform {
  backend "s3" {
    bucket  = "chatty-app-terraform-states"
    key     = "develop/chatapp.tfstate"
    region  = "eu-west-3"
    encrypt = true
  }
}

locals {
  prefix = "${var.prefix}-${terraform.workspace}"

  common_tags = {
    Environment = terraform.workspace
    Project     = var.project
    ManagedBy   = "Terraform"
    Owner       = "Tarik Nasraoui"
  }
}