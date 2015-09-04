# -*- mode: ruby -*-
# vi: set ft=ruby :

$script = <<SCRIPT
echo Shared folders suck on Windows, so just do everything in the VM using a repo in the (not shared) home directory
mkdir ~/repos
git clone https://github.com/mattbarton/horla.git horla
cd ~/repos/horla
SCRIPT

Vagrant.configure(2) do |config|
  config.vm.box = "mattbarton/node-aws"
  # add a few forwarded ports to use with node or other servers
  config.vm.network "forwarded_port", guest: 1313, host: 1313, auto_correct: true
  config.vm.network "forwarded_port", guest: 8000, host: 8000, auto_correct: true
  config.vm.network "forwarded_port", guest: 8080, host: 8080, auto_correct: true
  config.vm.network "forwarded_port", guest: 8888, host: 8888, auto_correct: true
  config.vm.provision "shell", inline: $script
end

