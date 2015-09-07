# -*- mode: ruby -*-
# vi: set ft=ruby :

# Recommended to install solarized palette for the terminal on your host machine, for example
# on Windows see: http://www.trueneutral.eu/2014/win-proper-term.html


# script to be run as 'vagrant' user, not root, usig `privileged: false`
$script = <<SCRIPT
git config --global credential.helper cache
git config --global user.email bartonmr@gmail.com
echo Shared folders suck on Windows, so just do everything in the VM using a repo in the VM home directory
mkdir ~/repos
git clone https://github.com/mattbarton/horla.git ~/repos/horla
cd ~/repos/horla
git remote set-url origin https://mattbarton@github.com/mattbarton/horla.git
npm install
echo You should probably go into ~/.dotfiles and do git pull when you login
SCRIPT

Vagrant.configure(2) do |config|
  config.vm.box = "mattbarton/node-aws"
  # add a few forwarded ports to use with node or other servers
  config.vm.network "forwarded_port", guest: 1313, host: 1313, auto_correct: true
  config.vm.network "forwarded_port", guest: 8000, host: 8000, auto_correct: true
  config.vm.network "forwarded_port", guest: 8080, host: 8080, auto_correct: true
  config.vm.network "forwarded_port", guest: 8888, host: 8888, auto_correct: true
  config.vm.provision "shell", inline: $script, privileged: false
end

